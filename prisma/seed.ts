import 'dotenv/config';
import { PrismaClient } from '@prisma/generated';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Add your seed data here
  console.log('Seeding database...');
  
  // Example:
  // await prisma.user.create({
  //   data: { name: 'Alice' }
  // });
  
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
