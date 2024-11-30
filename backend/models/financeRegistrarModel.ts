import { db } from '../config/dbConfig';
import { financeTable, rolesTable, usersTable } from '../db/tables'; 
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

interface FinanceRegistrar {
    id: number;
    username: string;
    password: string;
    role: string;
}

export const createFinanceEntry = async (data: any) => {
    try {
        await db.insert(financeTable).values(data).execute();
        console.log('✔️ Finance entry created successfully');
    } catch (error) {
        console.error('❌ Error creating finance entry:', error);
        throw new Error('Error creating finance entry');
    }
};

export const getFinanceRegistrarByUsername = async (username: string): Promise<FinanceRegistrar | null> => {
    try {
        const result = await db.select({
                id: usersTable.id,
                username: usersTable.username,
                password: usersTable.password,
                role: rolesTable.role_name
            })
            .from(usersTable)
            .innerJoin(financeTable, eq(usersTable.username, financeTable.registrarId))
            .innerJoin(rolesTable, eq(usersTable.role_id, rolesTable.id))
            .where(eq(usersTable.username, username))
            .limit(1)
            .execute();

        if (result.length === 0) {
            console.warn(`⚠️ No finance  found with username: ${username}`);
            return null;
        }

        const { id, username: user, password, role } = result[0];
        return { id, username: user, password, role } as FinanceRegistrar;
    } catch (error) {
        console.error(`❌ Error fetching finance  by username (${username}):`, error);
        throw new Error('Error fetching finance  from database');
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
