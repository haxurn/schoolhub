// backend/models/attendanceModel.ts

import { db } from '../config/dbConfig';
import { attendanceTable } from '../db/tables';
import { eq } from 'drizzle-orm';

export interface Attendance {
    id: number;
    userId: number;
    classId: number;
    attendanceDate: Date;
    status: string;
    comments?: string;
    createdAt: Date;
    updatedAt: Date;
}

export const createAttendance = async (attendanceData: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>) => {
    const sanitizedAttendanceData = {
        ...attendanceData,
        attendanceDate: attendanceData.attendanceDate.toISOString().split('T')[0], 
    };

    await db.insert(attendanceTable).values(sanitizedAttendanceData as any).execute();
};

export const getAttendanceById = async (id: number): Promise<Attendance | null> => {
    const result = await db
        .select({
            id: attendanceTable.id,
            userId: attendanceTable.userId,
            classId: attendanceTable.classId,
            attendanceDate: attendanceTable.attendanceDate,
            status: attendanceTable.status,
            comments: attendanceTable.comments,
            createdAt: attendanceTable.createdAt,
            updatedAt: attendanceTable.updatedAt,
        })
        .from(attendanceTable)
        .where(eq(attendanceTable.id, id))
        .limit(1)
        .execute();

    if (result.length === 0) {
        console.warn(`⚠️ No attendance record found with ID: ${id}`);
        return null;
    }

    const item = result[0];
    return {
        ...item,
        attendanceDate: new Date(item.attendanceDate), // Convert to Date
    } as Attendance;
};

export const getAllAttendances = async (): Promise<Attendance[]> => {
    const result = await db
        .select({
            id: attendanceTable.id,
            userId: attendanceTable.userId,
            classId: attendanceTable.classId,
            attendanceDate: attendanceTable.attendanceDate,
            status: attendanceTable.status,
            comments: attendanceTable.comments,
            createdAt: attendanceTable.createdAt,
            updatedAt: attendanceTable.updatedAt,
        })
        .from(attendanceTable)
        .execute();

    return result.map(item => ({
        ...item,
        attendanceDate: new Date(item.attendanceDate), // Convert to Date
    })) as Attendance[];
};
