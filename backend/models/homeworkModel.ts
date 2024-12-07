// backend/models/homeworkModel.ts

import { db } from '../config/dbConfig';
import { homeworkTable } from '../db/tables';
import { eq } from 'drizzle-orm';

interface Homework {
    id: number;
    classId: number;
    sectionId: number;
    subjectId: number;
    teacherId?: number;
    title: string;
    description: string;
    dueDate: Date;
    attachment?: string;
    createdAt: Date;
    updatedAt: Date;
}

export const createHomework = async (homeworkData: Omit<Homework, 'id' | 'createdAt' | 'updatedAt'>) => {
    const sanitizedHomeworkData = {
        ...homeworkData,
        teacherId: homeworkData.teacherId ?? null, // Handle optional teacherId
    };

    await db.insert(homeworkTable).values(sanitizedHomeworkData as any).execute();
};

export const getHomeworkById = async (id: number): Promise<Homework | null> => {
    const result = await db
        .select({
            id: homeworkTable.id,
            classId: homeworkTable.classId,
            sectionId: homeworkTable.sectionId,
            subjectId: homeworkTable.subjectId,
            teacherId: homeworkTable.teacherId,
            title: homeworkTable.title,
            description: homeworkTable.description,
            dueDate: homeworkTable.dueDate,
            attachment: homeworkTable.attachment,
            createdAt: homeworkTable.createdAt,
            updatedAt: homeworkTable.updatedAt,
        })
        .from(homeworkTable)
        .where(eq(homeworkTable.id, id))
        .limit(1)
        .execute();

    if (result.length === 0) {
        console.warn(`⚠️ No homework found with ID: ${id}`);
        return null;
    }

    const item = result[0];
    return {
        ...item,
        dueDate: item.dueDate ? new Date(item.dueDate) : undefined, 
    } as Homework;
};

export const getAllHomework = async (): Promise<Homework[]> => {
    const result = await db
        .select({
            id: homeworkTable.id,
            classId: homeworkTable.classId,
            sectionId: homeworkTable.sectionId,
            subjectId: homeworkTable.subjectId,
            teacherId: homeworkTable.teacherId,
            title: homeworkTable.title,
            description: homeworkTable.description,
            dueDate: homeworkTable.dueDate,
            attachment: homeworkTable.attachment,
            createdAt: homeworkTable.createdAt,
            updatedAt: homeworkTable.updatedAt,
        })
        .from(homeworkTable)
        .execute();

    return result.map(item => ({
        ...item,
        dueDate: item.dueDate ? new Date(item.dueDate) : undefined, 
    })) as Homework[];
};
