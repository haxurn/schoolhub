// backend/migrations/createTables.ts

import { db } from '../config/dbConfig';
import { rolesTable, usersTable } from '../db/tables';

const createTables = async () => {
    try {
        // Create roles table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS roles (
                id SERIAL PRIMARY KEY,
                role_name VARCHAR(100) UNIQUE NOT NULL
            )
        `);
        console.log('✔️ Roles table created successfully');

        // Create users table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role_id INTEGER REFERENCES roles(id) NOT NULL
            )
        `);
        console.log('✔️ Users table created successfully');
    } catch (error) {
        console.error('❌ Error creating tables:', error);
    }
};

createTables();

