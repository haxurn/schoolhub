// backend/models/classRoutineModel.ts

import { db } from '../config/dbConfig';
import { classRoutineTable } from '../db/tables';
import { eq } from 'drizzle-orm';

interface ClassRoutine {
    id: number;
    classId: number;
    sectionId: number;
    subjectId: number;
    teacherId?: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export const createClassRoutine = async (classRoutineData: Omit<ClassRoutine, 'id' | 'createdAt' | 'updatedAt'>) => {
    const sanitizedClassRoutineData = {
        ...classRoutineData,
        teacherId: classRoutineData.teacherId ?? null, // Handle optional teacherId
    };

    await db.insert(classRoutineTable).values(sanitizedClassRoutineData as any).execute();
};

export const getClassRoutineById = async (id: number): Promise<ClassRoutine | null> => {
    const result = await db
        .select({
            id: classRoutineTable.id,
            classId: classRoutineTable.classId,
            sectionId: classRoutineTable.sectionId,
            subjectId: classRoutineTable.subjectId,
            teacherId: classRoutineTable.teacherId,
            dayOfWeek: classRoutineTable.dayOfWeek,
            startTime: classRoutineTable.startTime,
            endTime: classRoutineTable.endTime,
            status: classRoutineTable.status,
            createdAt: classRoutineTable.createdAt,
            updatedAt: classRoutineTable.updatedAt,
        })
        .from(classRoutineTable)
        .where(eq(classRoutineTable.id, id))
        .limit(1)
        .execute();

    if (result.length === 0) {
        console.warn(`⚠️ No class routine found with ID: ${id}`);
        return null;
    }

    return result[0] as ClassRoutine;
};

export const getAllClassRoutines = async (): Promise<ClassRoutine[]> => {
    const result = await db
        .select({
            id: classRoutineTable.id,
            classId: classRoutineTable.classId,
            sectionId: classRoutineTable.sectionId,
            subjectId: classRoutineTable.subjectId,
            teacherId: classRoutineTable.teacherId,
            dayOfWeek: classRoutineTable.dayOfWeek,
            startTime: classRoutineTable.startTime,
            endTime: classRoutineTable.endTime,
            status: classRoutineTable.status,
            createdAt: classRoutineTable.createdAt,
            updatedAt: classRoutineTable.updatedAt,
        })
        .from(classRoutineTable)
        .execute();

    return result as ClassRoutine[];
};
