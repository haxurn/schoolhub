// backend/models/examinationModel.ts

import { db } from '../config/dbConfig';
import { examinationTable } from '../db/tables';
import { eq } from 'drizzle-orm';

interface Examination {
    id: number;
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    classId: number;
    sectionId: number;
    subjectId: number;
    maxMarks: number;
    duration: string;
    createdAt: Date;
    updatedAt: Date;
}

export const createExamination = async (examinationData: Omit<Examination, 'id' | 'createdAt' | 'updatedAt'>) => {
    const sanitizedExaminationData = {
        ...examinationData,
        startDate: examinationData.startDate.toISOString().split('T')[0], // Convert Date to string
        endDate: examinationData.endDate.toISOString().split('T')[0], // Convert Date to string
    };

    await db.insert(examinationTable).values(sanitizedExaminationData as any).execute();
};

export const getExaminationById = async (id: number): Promise<Examination | null> => {
    const result = await db
        .select({
            id: examinationTable.id,
            title: examinationTable.title,
            description: examinationTable.description,
            startDate: examinationTable.startDate,
            endDate: examinationTable.endDate,
            classId: examinationTable.classId,
            sectionId: examinationTable.sectionId,
            subjectId: examinationTable.subjectId,
            maxMarks: examinationTable.maxMarks,
            duration: examinationTable.duration,
            createdAt: examinationTable.createdAt,
            updatedAt: examinationTable.updatedAt,
        })
        .from(examinationTable)
        .where(eq(examinationTable.id, id))
        .limit(1)
        .execute();

    if (result.length === 0) {
        console.warn(`⚠️ No examination found with ID: ${id}`);
        return null;
    }

    const item = result[0];
    return {
        ...item,
        startDate: new Date(item.startDate), 
        endDate: new Date(item.endDate), 
    } as Examination;
};

export const getAllExaminations = async (): Promise<Examination[]> => {
    const result = await db
        .select({
            id: examinationTable.id,
            title: examinationTable.title,
            description: examinationTable.description,
            startDate: examinationTable.startDate,
            endDate: examinationTable.endDate,
            classId: examinationTable.classId,
            sectionId: examinationTable.sectionId,
            subjectId: examinationTable.subjectId,
            maxMarks: examinationTable.maxMarks,
            duration: examinationTable.duration,
            createdAt: examinationTable.createdAt,
            updatedAt: examinationTable.updatedAt,
        })
        .from(examinationTable)
        .execute();

    return result.map(item => ({
        ...item,
        startDate: new Date(item.startDate), 
        endDate: new Date(item.endDate), 
    })) as Examination[];
};
