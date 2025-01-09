// This file is used to create a global prisma client that can be used in the entire application
// This is done to avoid creating multiple instances of the prisma client
const { PrismaClient } = require('@prisma/client')

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;