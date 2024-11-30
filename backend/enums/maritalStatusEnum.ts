// backend/enums/maritalStatusEnum.ts

import { db } from '../config/dbConfig';

const createMaritalStatusEnum = async () => {
    try {
        const result = await db.execute(`
            SELECT 1 FROM pg_type WHERE typname = 'marital_status';
        `);

        if (result.rowCount === 0) {
            await db.execute(`
                CREATE TYPE marital_status AS ENUM (
                    'Single', 'Married', 'Divorced', 'Widowed'
                );
            `);
            console.log('✔️ MaritalStatus enum created successfully');
        } else {
            console.log('✔️ MaritalStatus enum already exists');
        }
    } catch (error) {
        console.error('❌ Error creating MaritalStatus enum:', error);
    }
};

export default createMaritalStatusEnum;
