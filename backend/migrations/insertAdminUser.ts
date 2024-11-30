// backend/migrations/insertAdminUser.ts

import { db } from '../config/dbConfig';
import bcrypt from 'bcrypt';
import { usersTable, rolesTable } from '../db/tables';
import { eq } from 'drizzle-orm';

const insertAdminUser = async () => {
    try {
        const saltRounds = 10;

        const plainTextPassword = process.env.ADMIN_PASSWORD;
        if (!plainTextPassword) {
            throw new Error('Admin password is not defined. Set ADMIN_PASSWORD in your environment variables.');
        }

        
        const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);

        
        const roleQuery = await db
            .select()
            .from(rolesTable)
            .where(eq(rolesTable.role_name, 'admin'))
            .execute();

        if (roleQuery.length === 0) {
            throw new Error('Admin role not found. Ensure the "rolesTable" has an entry for "admin".');
        }

        const roleId = roleQuery[0].id;

        
        await db
            .insert(usersTable)
            .values({
                username: 'Administrator',
                password: hashedPassword,
                role_id: roleId,
            })
            .execute();

        console.log('✔️ Admin user created successfully');
    } catch (error: any) {
        console.error('❌ Error creating admin user:', error.message || error);
    }
};

insertAdminUser();
