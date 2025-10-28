import filterProducts from "../constants/filter-products";
import { prisma } from "../index";
import axios from "axios";
import * as cheerio from "cheerio";

// Type definitions
interface ProductData {
    id: number;
    title: string;
    price: number;
    isActive: boolean;
}

interface CategoryData {
    categoryName: string;
    products: ProductData[];
}

const sql = require('mssql');
const fs = require('fs');
const path = require('path');

const config = {
    user: "UYMAR",
    password: "uymar_2424",
    server: "88.247.153.121",
    port: 51433,
    database: "ERP12",
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// Google görsel araması
async function getImageLink(query: string): Promise<string | null> {
    try {
        const searchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
        const { data: html } = await axios.get(searchUrl, {
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                "accept-language": "tr-TR,tr;q=0.7",
                "available-dictionary": ":CYkctt7YfSITDMGoXel2gki8fuDvPIQpoA8jKU6okC8=:",
                "cache-control": "max-age=0",
                "priority": "u=0, i",
                "sec-ch-ua": "\"Brave\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
                "sec-ch-ua-arch": "\"arm\"",
                "sec-ch-ua-bitness": "\"64\"",
                "sec-ch-ua-full-version-list": "\"Brave\";v=\"141.0.0.0\", \"Not?A_Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"141.0.0.0\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-model": "\"\"",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-ch-ua-platform-version": "\"15.3.0\"",
                "sec-ch-ua-wow64": "?0",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "sec-gpc": "1",
                "upgrade-insecure-requests": "1",
                "Referer": "https://www.google.com/"
            },
        });

        const $ = cheerio.load(html);

        const images: string[] = [];
        $('img').each((i, img) => {
            const src = $(img).attr('src');
            if (src && src.startsWith('http') && !src.includes('logo')) {
                images.push(src);
            }
        });

        return images.length > 0 ? images[0] : null;
    } catch (err) {
        console.error('❌ Resim alınamadı:', query);
        return null;
    }
}

// Ana sync fonksiyonu
export default async function syncProducts() {
    try {
        console.log('🔄 Ürün senkronizasyonu başlatılıyor...');

        // Başlangıç durumu
        const existingCategoriesCount = await prisma.category.count();
        const existingProductsCount = await prisma.product.count();
        console.log(`\n📊 MEVCUT DURUM:`);
        console.log(`   📦 Mevcut Kategori Sayısı: ${existingCategoriesCount}`);
        console.log(`   📝 Mevcut Ürün Sayısı: ${existingProductsCount}`);

        // 1. SQL Server'dan ürünleri çek
        console.log('📡 SQL Server\'dan ürünler çekiliyor...');
        let pool = await sql.connect(config);

        const result = await pool.request().query(`
            SELECT DISTINCT
                s.ID,
                s.AD as STOK_ADI,
                s.AKTIF,
                sf.FIYAT as SATIS_FIYATI
            FROM STOK s
            INNER JOIN STOK_STOK_BIRIM ssb ON s.ID = ssb.STOK
            INNER JOIN STOK_STOK_BIRIM_FIYAT sf ON ssb.ID = sf.STOK_STOK_BIRIM
            WHERE s.AKTIF = 1 
                AND s.AD IS NOT NULL 
                AND s.SON_ALIS_FIYAT > 0
                AND sf.FIYAT > 0
        `);

        const products = result.recordset.map((product: any) => ({
            id: product.ID,
            title: product.STOK_ADI,
            price: product.SATIS_FIYATI,
            isActive: product.AKTIF
        }));

        console.log(`✅ ${products.length} ürün çekildi`);

        // JSON dosyasına yaz (yedek)
        const outputPath = path.join(__dirname, '../public/products.json');
        fs.writeFileSync(outputPath, JSON.stringify(filterProducts(products), null, 2), 'utf-8');

        await sql.close();

        // 2. Ürünleri filtrele ve kategorize et
        console.log('🔍 Ürünler filtreleniyor ve kategorize ediliyor...');
        const categorizedProducts: CategoryData[] = filterProducts(products);

        console.log(`📁 ${categorizedProducts.length} kategori bulundu`);

        // Kategorileri listele
        console.log('\n📋 Bulunan kategoriler:');
        categorizedProducts.forEach((cat, index) => {
            console.log(`   ${index + 1}. ${cat.categoryName} (${cat.products.length} ürün)`);
        });

        // 3. Her kategori ve ürün için database'i güncelle
        let totalProcessed = 0;
        let totalUpdated = 0;
        let totalCreated = 0;
        let totalCategoriesCreated = 0;

        for (const categoryData of categorizedProducts) {
            const { categoryName, products: categoryProducts } = categoryData;

            console.log(`\n📦 Kategori İşleniyor: ${categoryName} (${categoryProducts.length} ürün)`);

            // Kategoriyi kontrol et veya oluştur
            let category = await prisma.category.findFirst({
                where: { name: categoryName }
            });

            if (!category) {
                try {
                    category = await prisma.category.create({
                        data: {
                            name: categoryName
                        }
                    });
                    console.log(`   ✅ KATEGORI OLUŞTURULDU: ${categoryName} (ID: ${category.id})`);
                    totalCategoriesCreated++;
                } catch (error) {
                    console.error(`   ❌ Kategori oluşturma hatası: ${categoryName}`, error);
                    continue; // Kategori oluşturulamazsa skip et
                }
            } else {
                console.log(`   ℹ️  Kategori zaten var: ${categoryName} (ID: ${category.id})`);
            }

            // Her ürün için işlem yap
            for (const product of categoryProducts) {
                try {
                    // Aynı isimli ürünü bul
                    const existingProduct = await prisma.product.findFirst({
                        where: {
                            name: product.title,
                            categoryId: category.id
                        }
                    });

                    if (existingProduct) {
                        // Ürün var, güncelle
                        const updateData: any = {
                            name: product.title,
                            price: product.price
                        };

                        // Eğer resim yoksa çek
                        if (!existingProduct.imageUrl) {
                            console.log(`   🔍 Resim aranıyor: ${product.title}`);
                            const imageUrl = await getImageLink(product.title);
                            if (imageUrl) {
                                updateData.imageUrl = imageUrl;
                                console.log(`   ✅ Resim bulundu: ${product.title}`);
                            }
                        }

                        await prisma.product.update({
                            where: { id: existingProduct.id },
                            data: updateData
                        });

                        totalUpdated++;
                    } else {
                        // Ürün yok, oluştur
                        console.log(`   🔍 Yeni ürün: ${product.title} - Resim aranıyor...`);
                        const imageUrl = await getImageLink(product.title);

                        await prisma.product.create({
                            data: {
                                name: product.title,
                                price: product.price,
                                categoryId: category.id,
                                imageUrl: imageUrl || null
                            }
                        });

                        if (imageUrl) {
                            console.log(`   ✅ Ürün oluşturuldu (resimli): ${product.title}`);
                        } else {
                            console.log(`   ✅ Ürün oluşturuldu (resimsiz): ${product.title}`);
                        }

                        totalCreated++;
                    }

                    totalProcessed++;

                    // Her 10 üründe bir ilerleme göster
                    if (totalProcessed % 10 === 0) {
                        const totalInCategory = categorizedProducts.reduce((sum, cat) => sum + cat.products.length, 0);
                        console.log(`   📊 İşlenen: ${totalProcessed}/${totalInCategory}`);
                    }

                } catch (error) {
                    console.error(`   ❌ Ürün işlenirken hata: ${product.title}`, error);
                }
            }
        }

        console.log('\n✅ Senkronizasyon tamamlandı!');
        console.log(`\n📊 ÖZET:`);
        console.log(`   📦 Yeni Oluşturulan Kategoriler: ${totalCategoriesCreated}`);
        console.log(`   📝 Toplam İşlenen Ürün: ${totalProcessed}`);
        console.log(`   ✏️  Güncellenen Ürün: ${totalUpdated}`);
        console.log(`   ➕ Yeni Oluşturulan Ürün: ${totalCreated}`);
        console.log(`   📁 JSON yedeği: ${outputPath}`);

        // Veritabanındaki kategori sayısını göster
        const totalCategories = await prisma.category.count();
        const totalProducts = await prisma.product.count();
        console.log(`\n🗄️  VERİTABANI DURUMU:`);
        console.log(`   📦 Toplam Kategori: ${totalCategories}`);
        console.log(`   📝 Toplam Ürün: ${totalProducts}`);

    } catch (err: any) {
        console.error('❌ Hata:', err.message);
        throw err;
    }
}