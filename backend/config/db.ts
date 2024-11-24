// backend/config/db.ts

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, PoolClient } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

export const db = drizzle(pool);

export const testConnection = async () => {
    try {
        const client: PoolClient = await pool.connect();
        console.log(`🛢️  Database connected successfully on port ${process.env.DB_PORT}`);
        client.release();
    } catch (err) {
        console.error('❌ Error to connect to the database', err);
    }
};
