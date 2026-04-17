/**
 * Shared Prisma client instance
 * Uses singleton pattern to prevent multiple instances
 */

import { PrismaClient } from '@prisma/generated';
import { PrismaPg } from '@prisma/adapter-pg';

declare global {
  var __prismaSingletonForHotReload: PrismaClient | undefined;
}

global.__prismaSingletonForHotReload =
  global.__prismaSingletonForHotReload ||
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    }),
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
export const prisma = global.__prismaSingletonForHotReload;

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
