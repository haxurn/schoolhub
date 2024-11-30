// backend/enums/workShiftEnum.ts

import { db } from '../config/dbConfig';

const createWorkShiftEnum = async () => {
    try {
        const result = await db.execute(`
            SELECT 1 FROM pg_type WHERE typname = 'work_shift';
        `);

        if (result.rowCount === 0) {
            await db.execute(`
                CREATE TYPE work_shift AS ENUM (
                    'Morning', 'Afternoon', 'Both'
                );
            `);
            console.log('✔️ WorkShift enum created successfully');
        } else {
            console.log('✔️ WorkShift enum already exists');
        }
    } catch (error) {
        console.error('❌ Error creating WorkShift enum:', error);
    }
};

export default createWorkShiftEnum;
