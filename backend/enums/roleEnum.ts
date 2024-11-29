// backend/enums/roleEnum.ts

import { db } from '../config/dbConfig';

const createRoleEnum = async () => {
    try {
        await db.execute(`
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_type') THEN
                    CREATE TYPE role_type AS ENUM ('admin', 'teacher', 'student', 'parent', 'library_staff', 'finance');
                ELSE
                    ALTER TYPE role_type ADD VALUE IF NOT EXISTS 'finance';
                END IF;
            END $$;
        `);

        console.log('✔️ Role type created successfully or already exists');
    } catch (error) {
        console.error('❌ Error creating role type:', error);
    }
};

export default createRoleEnum;
