import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  await prisma.orderItem.deleteMany();
  console.log('✅ Order items deleted');

  await prisma.product.deleteMany();
  console.log('✅ Products deleted');

  await prisma.category.deleteMany();
  console.log('✅ Categories deleted');



  await prisma.order.deleteMany();
  console.log('✅ Orders deleted');
  await prisma.user.deleteMany();
  console.log('✅ Users deleted');

  await prisma.category.createMany({
    data: [
      { imageUrl: "et-ve-tavuk.jpg", name: "Et ve Tavuk", id: slugify("Et ve Tavuk") },
      { imageUrl: "meyve-ve-sebze.jpg", name: "Meyve ve Sebze", id: slugify("Meyve ve Sebze") },
      { imageUrl: "kahvaltiliklar.jpg", name: "Kahvaltılıklar", id: slugify("Kahvaltılıklar") },
      { imageUrl: "sut-urunleri.jpg", name: "Süt Ürünleri", id: slugify("Süt Ürünleri") },
      { imageUrl: "temel-gida.jpg", name: "Temel Gıda", id: slugify("Temel Gıda") },
      { imageUrl: "firin-ve-pastane.jpg", name: "Fırın ve Pastane", id: slugify("Fırın ve Pastane") },
      { imageUrl: "donuk-ve-hazir-gida.jpg", name: "Donuk ve Hazır Gıda", id: slugify("Donuk ve Hazır Gıda") },
      { imageUrl: "dondurma-ve-tatli.jpg", name: "Dondurma ve Tatlı", id: slugify("Dondurma ve Tatlı") },
      { imageUrl: "atistirmaliklar.jpg", name: "Atıştırmalık", id: slugify("Atıştırmalık") },
      { imageUrl: "su-ve-icecekler.jpg", name: "Su ve İçecekler", id: slugify("Su ve İçecekler") },
      { imageUrl: "kisisel-bakim.jpg", name: "Kişisel Bakım", id: slugify("Kişisel Bakım") },
      { imageUrl: "temizlik-urunleri.jpg", name: "Temizlik Ürünleri", id: slugify("Temizlik Ürünleri") },
      { imageUrl: "bebek-evreni.jpg", name: "Bebek Evreni", id: slugify("Bebek Evreni") },
      { imageUrl: "evcil-dostlarimiz.jpg", name: "Evcil Dostlarımız", id: slugify("Evcil Dostlarımız") },
      { imageUrl: "ev-ve-yasam.jpg", name: "Ev ve Yaşam", id: slugify("Ev ve Yaşam") },
      { imageUrl: "ofis-ve-teknoloji.jpg", name: "Ofis ve Teknoloji", id: slugify("Ofis ve Teknoloji") },
      { name: "Diğer", id: slugify("Diğer") },
    ],
    skipDuplicates: true
  });
  console.log('✅ Categories created');

  // Create admin user (username concept mapped to fullName), password: UymarMarket2341
  const adminPasswordHash = await bcrypt.hash('UymarMarket2341', 10);
  await prisma.user.upsert({
    where: { phone: '900000000000' },
    update: { fullName: 'uymar2025', role: 'ADMIN', passwordHash: adminPasswordHash },
    create: { fullName: 'uymar2025', phone: '900000000000', passwordHash: adminPasswordHash, role: 'ADMIN' }
  });
  console.log('✅ Admin user ensured');

  // Read products from src/urunler.json
  const filePath = path.resolve('./src/urunler.json');
  if (!fs.existsSync(filePath)) {
    console.warn('⚠️ urunler.json not found at', filePath);
  } else {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const items: any = JSON.parse(raw);
    let count = 0;
    for (const it of items) {
      try {
        await prisma.product.create({
          data: {
            name: it.title,
            price: Number(it.price) || 0,
            isActive: it.isActive !== false,
            categoryId: slugify(it.category) || slugify("Diğer"),
            imageUrl: it.imageUrl || null,
          }
        });
        count++;
      } catch (e) {
        console.error('Failed to create product', it.title, e);
      }
    }
    console.log(`✅ Products created from JSON: ${count}`);
  }

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
