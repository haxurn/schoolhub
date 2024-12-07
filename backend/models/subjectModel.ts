// backend/models/subjectModel.ts

import { db } from '../config/dbConfig';
import { subjectTable } from '../db/tables';
import { eq } from 'drizzle-orm';

interface Subject {
    id: number;
    name: string;
    code: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

export const createSubject = async (subjectData: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) => {
    await db.insert(subjectTable).values(subjectData).execute();
};

export const getSubjectById = async (id: number): Promise<Subject | null> => {
    const result = await db
        .select()
        .from(subjectTable)
        .where(eq(subjectTable.id, id))
        .limit(1)
        .execute();

    if (result.length === 0) {
        console.warn(`⚠️ No subject found with ID: ${id}`);
        return null;
    }

    return result[0] as Subject;
};

export const getAllSubjects = async (): Promise<Subject[]> => {
    const result = await db
        .select()
        .from(subjectTable)
        .execute();

    return result as Subject[];
};
