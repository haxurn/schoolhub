// backend/config/dbConfig.ts

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

export const checkConnection = async () => {
    try {
        // Prisma doesn't require explicit pool connection, just use `prisma.$connect()` to test connection
        await prisma.$connect();
        console.log('📦 Database connection successful!');
    } catch (error) {
        console.error("❌ Database connection failed", error);
    }
};

export { prisma };
