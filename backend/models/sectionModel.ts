// backend/models/sectionModel.ts

import { db } from '../config/dbConfig';
import { sectionTable } from '../db/tables';
import { eq } from 'drizzle-orm';

interface Section {
    id: number;
    sectionName: string;
    sectionCode: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export const createSection = async (sectionData: Omit<Section, 'id' | 'createdAt' | 'updatedAt'>) => {
    await db.insert(sectionTable).values(sectionData).execute();
};

export const getSectionById = async (id: number): Promise<Section | null> => {
    const result = await db
        .select()
        .from(sectionTable)
        .where(eq(sectionTable.id, id))
        .limit(1)
        .execute();

    if (result.length === 0) {
        console.warn(`⚠️ No section found with ID: ${id}`);
        return null;
    }

    return result[0] as Section;
};

export const getAllSections = async (): Promise<Section[]> => {
    const result = await db
        .select()
        .from(sectionTable)
        .execute();

    return result as Section[];
};
