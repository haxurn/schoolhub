// backend/models/userLibraryUsageModel.ts

import { db } from '../config/dbConfig';
import { userLibraryUsageTable } from '../db/tables';
import { eq } from 'drizzle-orm';

interface UserLibraryUsage {
    id: number;
    userId: number;
    libraryId: number;
    borrowDate: Date;
    returnDate?: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export const createUserLibraryUsage = async (usageData: Omit<UserLibraryUsage, 'id' | 'createdAt' | 'updatedAt'>) => {
    await db.insert(userLibraryUsageTable).values(usageData).execute();
};

export const getUserLibraryUsageById = async (id: number): Promise<UserLibraryUsage | null> => {
    const result = await db
        .select()
        .from(userLibraryUsageTable)
        .where(eq(userLibraryUsageTable.id, id))
        .limit(1)
        .execute();

    if (result.length === 0) {
        console.warn(`⚠️ No usage record found with ID: ${id}`);
        return null;
    }

    return result[0] as UserLibraryUsage;
};

export const getUserLibraryUsagesByUserId = async (userId: number): Promise<UserLibraryUsage[]> => {
    const result = await db
        .select()
        .from(userLibraryUsageTable)
        .where(eq(userLibraryUsageTable.userId, userId))
        .execute();

    return result as UserLibraryUsage[];
};
