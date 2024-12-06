// backend/config/dbConfig.ts

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
export const db = drizzle(pool);

export const checkConnection = async () => {
    try {
        await pool.connect();
        console.log('📦 Database connection successful!');
    } catch (error) { 
        console.error("❌ Database connection failed", error);
    }
};


