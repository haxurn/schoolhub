// backend/enums/bloodGroupEnum.ts

import { db } from '../config/dbConfig';

const createBloodGroupEnum = async () => {
    try {
        const result = await db.execute(`
            SELECT 1 FROM pg_type WHERE typname = 'blood_group';
        `);

        if (result.rowCount === 0) {
            await db.execute(`
                CREATE TYPE blood_group AS ENUM (
                    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
                );
            `);
            console.log('✔️ BloodGroup enum created successfully');
        } else {
            console.log('✔️ BloodGroup enum already exists');
        }
    } catch (error) {
        console.error('❌ Error creating BloodGroup enum:', error);
    }
};

export default createBloodGroupEnum;
