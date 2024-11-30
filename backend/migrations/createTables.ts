// backend/migrations/createTables.ts

import { db } from '../config/dbConfig';

const createTables = async () => {
    try {
       
        await db.execute(`
            CREATE TABLE IF NOT EXISTS roles (
                id SERIAL PRIMARY KEY,
                role_name VARCHAR(100) UNIQUE NOT NULL
            )
        `);
        console.log('✔️ Roles table created successfully');

    
        await db.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role_id INTEGER REFERENCES roles(id) NOT NULL
            )
        `);
        console.log('✔️ Users table created successfully');

       
        await db.execute(`
            CREATE TABLE IF NOT EXISTS finance (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(100) NOT NULL,
                registrar_id VARCHAR(8) UNIQUE NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                primary_contact_number VARCHAR(20) NOT NULL,
                email_address VARCHAR(255) UNIQUE NOT NULL,
                blood_group VARCHAR(5) NOT NULL,
                image VARCHAR(255),
                date_of_joining DATE NOT NULL,
                gender VARCHAR(20) NOT NULL,
                fathers_name VARCHAR(100) NOT NULL,
                mothers_name VARCHAR(100) NOT NULL,
                date_of_birth DATE NOT NULL,
                marital_status VARCHAR(50) NOT NULL,
                languages_known TEXT,
                qualification VARCHAR(255) NOT NULL,
                work_experience INTEGER NOT NULL,
                previous_work VARCHAR(255),
                previous_work_address VARCHAR(255),
                previous_work_phone_number VARCHAR(20),
                address VARCHAR(255) NOT NULL,
                permanent_address VARCHAR(255) NOT NULL,
                pan_number VARCHAR(20) NOT NULL,
                epf_number VARCHAR(20) NOT NULL,
                basic_salary INTEGER NOT NULL,
                contract_type VARCHAR(50) NOT NULL,
                work_shift VARCHAR(50) NOT NULL,
                work_location VARCHAR(255) NOT NULL,
                date_of_leaving DATE,
                medical_leaves INTEGER NOT NULL,
                casual_leaves INTEGER NOT NULL,
                maternity_leaves INTEGER NOT NULL,
                sick_leaves INTEGER NOT NULL,
                account_name VARCHAR(100) NOT NULL,
                account_number VARCHAR(20) NOT NULL,
                bank_name VARCHAR(100) NOT NULL,
                ifsc_code VARCHAR(20) NOT NULL,
                facebook VARCHAR(255),
                instagram VARCHAR(255),
                linkedin VARCHAR(255),
                youtube VARCHAR(255),
                twitter_url VARCHAR(255),
                resume VARCHAR(255),
                joining_letter VARCHAR(255),
                personal_docs VARCHAR(255),
                password VARCHAR(255) NOT NULL
            )
        `);
        console.log('✔️ Finance table created successfully');
    } catch (error) {
        console.error('❌ Error creating tables:', error);
    }
};

createTables();
