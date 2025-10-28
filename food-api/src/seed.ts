import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create only "Diğer" category
  const category = await prisma.category.upsert({
    where: { name: 'Diğer', id: "diger" },
    update: {},
    create: { name: 'Diğer', id: "diger" }
  });
  console.log('✅ Category created:', category.name);

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
    const items = JSON.parse(raw) as Array<{ id?: string; title: string; price: number; isActive?: boolean }>;
    let count = 0;
    for (const it of items) {
      try {
        await prisma.product.create({
          data: {
            name: it.title,
            price: Number(it.price) || 0,
            isActive: it.isActive !== false,
            categoryId: category.id,
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
