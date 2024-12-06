// backend/models/reportModel.ts

import { db } from '../config/dbConfig';
import { reportTable } from '../db/tables';
import { eq } from 'drizzle-orm';

interface Report {
    id: number;
    userId: number;
    reportType: string;
    content: string;
    attachment?: string;
    createdAt: Date;
    updatedAt: Date;
}

export const createReport = async (reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => {
    await db.insert(reportTable).values(reportData).execute();
};

export const getReportById = async (id: number): Promise<Report | null> => {
    const result = await db
        .select()
        .from(reportTable)
        .where(eq(reportTable.id, id))
        .limit(1)
        .execute();

    if (result.length === 0) {
        console.warn(`⚠️ No report found with ID: ${id}`);
        return null;
    }

    return result[0] as Report;
};

export const getReportsByUserId = async (userId: number): Promise<Report[]> => {
    const result = await db
        .select()
        .from(reportTable)
        .where(eq(reportTable.userId, userId))
        .execute();

    return result as Report[];
};
