// backend/models/parentsModel.ts

import { db } from '../config/dbConfig';
import { eq } from 'drizzle-orm';
import { parentsTable } from '../db/tables';
import bcrypt from 'bcrypt';

interface Parent {
    id: number;
    studentId: number;
    fatherName: string;
    fatherEmail: string;
    fatherPhone: string;
    fatherOccupation: string;
    fatherUpload?: string;
    motherName: string;
    motherEmail: string;
    motherPhone: string;
    motherOccupation: string;
    motherUpload?: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export const getParentByStudentId = async (studentId: number): Promise<Parent | null> => {
    try {
        const result = await db
            .select({
                id: parentsTable.id,
                studentId: parentsTable.studentId,
                fatherName: parentsTable.fatherName,
                fatherEmail: parentsTable.fatherEmail,
                fatherPhone: parentsTable.fatherPhone,
                fatherOccupation: parentsTable.fatherOccupation,
                fatherUpload: parentsTable.fatherUpload,
                motherName: parentsTable.motherName,
                motherEmail: parentsTable.motherEmail,
                motherPhone: parentsTable.motherPhone,
                motherOccupation: parentsTable.motherOccupation,
                motherUpload: parentsTable.motherUpload,
                createdAt: parentsTable.createdAt,
                password: parentsTable.password,
                updatedAt: parentsTable.updatedAt,
            })
            .from(parentsTable)
            .where(eq(parentsTable.studentId, studentId))
            .limit(1)
            .execute();

        if (result.length === 0) {
            console.warn(`⚠️ No parent found with student ID: ${studentId}`);
            return null;
        }

        return result[0] as Parent;
    } catch (error) {
        console.error(`❌ Error fetching parent by student ID (${studentId}):`, error);
        throw new Error('Error fetching parent from database');
    }
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        console.error('❌ Error comparing passwords:', error);
        throw new Error('Error comparing passwords');
    }
};

export const createParent = async (parentData: Omit<Parent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const hashedPassword = await bcrypt.hash(parentData.password, 10);
    await db.insert(parentsTable).values({
        ...parentData,
        password: hashedPassword,
    }).execute();
};

export const getParentByEmail = async (email: string): Promise<Parent | null> => {
    try {
        const result = await db
            .select({
                id: parentsTable.id,
                studentId: parentsTable.studentId,
                fatherName: parentsTable.fatherName,
                fatherEmail: parentsTable.fatherEmail,
                fatherPhone: parentsTable.fatherPhone,
                fatherOccupation: parentsTable.fatherOccupation,
                fatherUpload: parentsTable.fatherUpload,
                motherName: parentsTable.motherName,
                motherEmail: parentsTable.motherEmail,
                motherPhone: parentsTable.motherPhone,
                motherOccupation: parentsTable.motherOccupation,
                motherUpload: parentsTable.motherUpload,
                password: parentsTable.password,
                createdAt: parentsTable.createdAt,
                updatedAt: parentsTable.updatedAt,
            })
            .from(parentsTable)
            .where(eq(parentsTable.fatherEmail, email))
            .limit(1)
            .execute();

        if (result.length === 0) {
            console.warn(`⚠️ No parent found with email: ${email}`);
            return null;
        }

        return result[0] as Parent;
    } catch (error) {
        console.error(`❌ Error fetching parent by email (${email}):`, error);
        throw new Error('Error fetching parent from database');
    }
};

export const loginParent = async (email: string, password: string): Promise<Parent | null> => {
    const parent = await getParentByEmail(email);
    if (!parent) {
        return null;
    }

    const isPasswordValid = await comparePassword(password, parent.password);
    if (!isPasswordValid) {
        return null;
    }

    return parent;
};
