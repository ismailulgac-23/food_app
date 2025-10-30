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
      { name: "Et ve Tavuk", id: slugify("Et ve Tavuk") },
      { name: "Meyve ve Sebze", id: slugify("Meyve ve Sebze") },
      { name: "Kahvaltılıklar", id: slugify("Kahvaltılıklar") },
      { name: "Süt Ürünleri", id: slugify("Süt Ürünleri") },
      { name: "Temel Gıda", id: slugify("Temel Gıda") },
      { name: "Fırın ve Pastane", id: slugify("Fırın ve Pastane") },
      { name: "Donuk ve Hazır Gıda", id: slugify("Donuk ve Hazır Gıda") },
      { name: "Dondurma ve Tatlı", id: slugify("Dondurma ve Tatlı") },
      { name: "Atıştırmalık", id: slugify("Atıştırmalık") },
      { name: "Su ve İçecekler", id: slugify("Su ve İçecekler") },
      { name: "Kişisel Bakım", id: slugify("Kişisel Bakım") },
      { name: "Temizlik Ürünleri", id: slugify("Temizlik Ürünleri") },
      { name: "Bebek Evreni", id: slugify("Bebek Evreni") },
      { name: "Evcil Dostlarımız", id: slugify("Evcil Dostlarımız") },
      { name: "Ev ve Yaşam", id: slugify("Ev ve Yaşam") },
      { name: "Ofis ve Teknoloji", id: slugify("Ofis ve Teknoloji") },
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
        console.log('it', it.imageUrl);

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
