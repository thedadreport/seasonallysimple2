import { PrismaClient } from '@prisma/client';

// Global Prisma instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Safe Prisma client initialization with build-time guards
export function getPrismaClient(): PrismaClient | null {
  // No database URL available
  if (!process.env.POSTGRES_PRISMA_URL) {
    return null;
  }
  
  // Prevent database initialization during build process
  // Vercel sets VERCEL_ENV during runtime but not during build
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV) {
    return null;
  }

  // Return existing instance if available
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  try {
    globalForPrisma.prisma = new PrismaClient();
    return globalForPrisma.prisma;
  } catch (error) {
    console.error('Failed to initialize Prisma client:', error);
    return null;
  }
}

// Singleton instance
export const prisma = getPrismaClient();