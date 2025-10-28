import filterProducts from "src/constants/filter-products";

// npm i mssql
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

let requestCount = 0;

export default async () => {
    try {
        let pool = await sql.connect(config);

        console.log('📝 Aktif ürünler çekiliyor...');

        // Fiyatlı (hem alış hem satış) aktif ürünleri çek (6k civarı ürün)
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

        // Sadece istediğimiz alanları map et
        const products = result.recordset.map(product => ({
            id: product.ID,
            title: product.STOK_ADI,
            price: product.SATIS_FIYATI,
            isActive: product.AKTIF
        }));

        // JSON dosyasına yaz
        const outputPath = path.join(__dirname, '../public/products.json');
        fs.writeFileSync(outputPath, JSON.stringify(filterProducts(products), null, 2), 'utf-8');

        console.log(`✅ ${products.length} aktif ürün products.json dosyasına yazıldı!`);
        console.log(`📁 Dosya yolu: ${outputPath}`);
        console.log(`📁 Dosya boyutu: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);

        await sql.close();
    } catch (err) {
        console.error('❌ Hata:', err.message);
    }
}


