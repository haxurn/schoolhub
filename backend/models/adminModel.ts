// backend/models/adminModel.ts

import { db } from '../config/dbConfig';
import { usersTable, rolesTable } from '../db/tables';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

interface Admin {
    id: number;
    username: string;
    password: string;
    role: string; 
}

export const getAdminByUsername = async (username: string): Promise<Admin | null> => {
    try {
        const result = await db
            .select({
                id: usersTable.id,
                username: usersTable.username,
                password: usersTable.password,
                role: rolesTable.role_name
            })
            .from(usersTable)
            .leftJoin(rolesTable, eq(usersTable.role_id, rolesTable.id))
            .where(eq(usersTable.username, username))
            .limit(1)
            .execute();

        if (result.length === 0) {
            console.warn(`⚠️ No admin found with username: ${username}`);
            return null;
        }

        const { id, username: user, password, role } = result[0];
        return { id, username: user, password, role } as Admin;
    } catch (error) {
        console.error(`❌ Error fetching admin by username (${username}):`, error);
        throw new Error('Error fetching admin from database');
    }
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        console.error('❌ Error comparing passwords:', error);
        throw new Error('Error comparing passwords');
    }
};
