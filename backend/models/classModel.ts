// backend/models/classModel.ts

import { db } from '../config/dbConfig';
import { classTable } from '../db/tables';
import { eq } from 'drizzle-orm';

export interface Class {
    id: number;
    className: string;
    classCode: string;
    teacherId: number;
    studentCount: number;
    status: string;
    sectionId: number;
    createdAt: Date;
    updatedAt: Date;
}

export const createClass = async (classData: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>) => {
    await db.insert(classTable).values(classData).execute();
};

export const getClassById = async (id: number): Promise<Class | null> => {
    const result = await db
        .select()
        .from(classTable)
        .where(eq(classTable.id, id))
        .limit(1)
        .execute();

    if (result.length === 0) {
        console.warn(`⚠️ No class found with ID: ${id}`);
        return null;
    }

    return result[0] as Class;
};

export const getAllClasses = async (): Promise<Class[]> => {
    const result = await db
        .select()
        .from(classTable)
        .execute();

    return result as Class[];
};
