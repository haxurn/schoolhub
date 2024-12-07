// backend/models/parentModel.ts

import { eq, or } from 'drizzle-orm';
import { db } from '../config/dbConfig';
import { studentTable, parentsTable } from '../db/tables';

export interface Parent {
    id: number;
    studentId: number;
    fatherName: string;
    fatherEmail: string;
    fatherPhone: string;
    fatherOccupation: string;
    fatherUpload: string | null;
    motherName: string;
    motherEmail: string;
    motherPhone: string;
    motherOccupation: string;
    motherUpload: string | null;
    password: string;
    createdAt: Date;
    updatedAt: Date | null;
}

export interface ParentWithChildren extends Parent {
    children: Array<{
        id: number;
        firstName: string;
        lastName: string;
        admissionNumber: string;
        class: string;
        section: string | null;
    }>;
}

export const getParentByEmail = async (email: string): Promise<Parent | null> => {
    try {
        const parent = await db
            .select()
            .from(parentsTable)
            .where(or(
                eq(parentsTable.fatherEmail, email),
                eq(parentsTable.motherEmail, email)
            ));

        return parent.length > 0 ? parent[0] : null;
    } catch (error) {
        console.error('Error in getParentByEmail:', error);
        throw error;
    }
};

export const getParentWithChildren = async (parentId: number): Promise<ParentWithChildren | null> => {
    try {
        const parent = await db
            .select()
            .from(parentsTable)
            .where(eq(parentsTable.id, parentId))
            .limit(1);

        if (!parent || parent.length === 0) {
            return null;
        }

        const children = await db
            .select({
                id: studentTable.id,
                firstName: studentTable.firstName,
                lastName: studentTable.lastName,
                admissionNumber: studentTable.admissionNumber,
                class: studentTable.class,
                section: studentTable.section,
            })
            .from(studentTable)
            .where(eq(parentsTable.studentId, studentTable.id));

        return {
            ...parent[0],
            children,
        };
    } catch (error) {
        console.error('Error in getParentWithChildren:', error);
        throw error;
    }
};
