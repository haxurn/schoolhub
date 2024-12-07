// backend/models/timetableModel.ts

import { db } from '../config/dbConfig';
import { timetableTable } from '../db/tables';
import { eq } from 'drizzle-orm';

interface Timetable {
    id: number;
    classId: number;
    sectionId: number;
    subjectId: number;
    teacherId?: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    createdAt: Date;
    updatedAt: Date;
}

export const createTimetable = async (timetableData: Omit<Timetable, 'id' | 'createdAt' | 'updatedAt'>) => {
    const sanitizedTimetableData = {
        ...timetableData,
        teacherId: timetableData.teacherId ?? null, // Handle optional teacherId
    };

    await db.insert(timetableTable).values(sanitizedTimetableData as any).execute();
};

export const getTimetableById = async (id: number): Promise<Timetable | null> => {
    const result = await db
        .select({
            id: timetableTable.id,
            classId: timetableTable.classId,
            sectionId: timetableTable.sectionId,
            subjectId: timetableTable.subjectId,
            teacherId: timetableTable.teacherId,
            dayOfWeek: timetableTable.dayOfWeek,
            startTime: timetableTable.startTime,
            endTime: timetableTable.endTime,
            createdAt: timetableTable.createdAt,
            updatedAt: timetableTable.updatedAt,
        })
        .from(timetableTable)
        .where(eq(timetableTable.id, id))
        .limit(1)
        .execute();

    if (result.length === 0) {
        console.warn(`⚠️ No timetable entry found with ID: ${id}`);
        return null;
    }

    return result[0] as Timetable;
};

export const getAllTimetables = async (): Promise<Timetable[]> => {
    const result = await db
        .select({
            id: timetableTable.id,
            classId: timetableTable.classId,
            sectionId: timetableTable.sectionId,
            subjectId: timetableTable.subjectId,
            teacherId: timetableTable.teacherId,
            dayOfWeek: timetableTable.dayOfWeek,
            startTime: timetableTable.startTime,
            endTime: timetableTable.endTime,
            createdAt: timetableTable.createdAt,
            updatedAt: timetableTable.updatedAt,
        })
        .from(timetableTable)
        .execute();

    return result as Timetable[];
};
