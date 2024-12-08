// backend/models/userLibraryUsageModel.ts

import { db } from '../config/dbConfig';
import { userLibraryUsageTable } from '../db/tables';
import { eq } from 'drizzle-orm';

interface UserLibraryUsage {
    id: number;
    userId: number;
    libraryId: number;
    borrowDate: Date;
    dueDate: Date;
    returnDate?: Date;
    status: string;
    fine?: string;
    createdAt: Date;
    updatedAt: Date;
}

export const createUserLibraryUsage = async (usageData: Omit<UserLibraryUsage, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Ensure all required fields are present
    const completeUsageData = {
        ...usageData,
        borrowDate: usageData.borrowDate || new Date(),
        dueDate: usageData.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        status: usageData.status || 'active',
        fine: usageData.fine || '0',
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const result = await db
        .insert(userLibraryUsageTable)
        .values(completeUsageData)
        .returning();

    return result[0] as UserLibraryUsage;
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
