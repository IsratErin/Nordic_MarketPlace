import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const prismaTestClient = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // Ensure .env.test is loaded before this
    },
  },
});
console.log('Prisma Test Client connected to:', process.env.DATABASE_URL);
export default prismaTestClient;
