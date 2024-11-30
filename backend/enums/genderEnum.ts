// backend/enums/genderEnum.ts

import { db } from '../config/dbConfig';

const createGenderEnum = async () => {
    try {
        const result = await db.execute(`
            SELECT 1 FROM pg_type WHERE typname = 'gender';
        `);

        if (result.rowCount === 0) {
            await db.execute(`
                CREATE TYPE gender AS ENUM (
                    'Male', 'Female', 'Other'
                );
            `);
            console.log('✔️ Gender enum created successfully');
        } else {
            console.log('✔️ Gender enum already exists');
        }
    } catch (error) {
        console.error('❌ Error creating Gender enum:', error);
    }
};

export default createGenderEnum;
