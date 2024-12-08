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

export interface Child {
    id: number;
    firstName: string;
    lastName: string;
    admissionNumber: string;
    class: string;
    section: string | null;
}

export interface ParentWithChildren extends Parent {
    children: Child[];
}

/**
 * Fetches a parent record by email, matching either father's or mother's email.
 * 
 * @param email - The parent's email (father's or mother's)
 * @returns The parent record or null if not found
 */
export const getParentByEmail = async (email: string): Promise<Parent | null> => {
    try {
        const [parent] = await db
            .select()
            .from(parentsTable)
            .where(
                or(
                    eq(parentsTable.fatherEmail, email),
                    eq(parentsTable.motherEmail, email)
                )
            );

        return parent || null;
    } catch (error) {
        console.error('Error in getParentByEmail:', error);
        throw error;
    }
};

/**
 * Fetches a parent record along with their children.
 * 
 * @param parentId - The ID of the parent
 * @returns The parent with children or null if not found
 */
export const getParentWithChildren = async (parentId: number): Promise<ParentWithChildren | null> => {
    try {
        // Fetch the parent record
        const [parent] = await db
            .select()
            .from(parentsTable)
            .where(eq(parentsTable.id, parentId))
            .limit(1);

        if (!parent) {
            return null;
        }

        // Fetch the children records associated with the parent
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
            .where(eq(studentTable.id, parent.studentId)); 

        return {
            ...parent,
            children,
        };
    } catch (error) {
        console.error('Error in getParentWithChildren:', error);
        throw error;
    }
};
