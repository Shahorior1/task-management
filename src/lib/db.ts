import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Handle connection issues
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

export const prisma = globalForPrisma.prisma || prismaClientSingleton();

// Add better error handling
prisma.$use(async (params, next) => {
  try {
    return await next(params);
  } catch (error) {
    console.error(`Prisma Error: ${params.model}.${params.action}`, error);
    throw error;
  }
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 