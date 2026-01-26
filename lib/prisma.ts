import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/generated';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
  max: 1, // Critical for serverless - prevent connection exhaustion
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 10000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ 
  adapter,
  log: ['query', 'info', 'warn', 'error'] 
});

const globalForPrisma = global as unknown as { prisma: typeof prisma };

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
