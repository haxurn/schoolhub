// backend/models/studentModel.ts

import { db } from '../config/dbConfig';
import { eq } from 'drizzle-orm';
import { studentTable } from '../db/tables';
import bcrypt from 'bcrypt';

interface Student {
    id: number;
    firstName: string;
    admissionNumber: string;
    lastName: string;
    admissionDate: Date;
    rollNumber?: string;
    class: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | 'k-1' | 'k-2' | 'k-3';
    section?: string;
    gender: 'Male' | 'Female' | 'Other';
    religionStatus: 'Christian' | 'Muslim' | 'Other';
    emailAddress?: string;
    motherTongue: string;
    languagesKnown: string;
    dateOfBirth: Date;
    image: string;
    password: string;
    bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    createdAt: Date;
    updatedAt: Date;
}

export const createStudent = async (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    const sanitizedStudentData = {
        ...studentData,
        admissionDate: studentData.admissionDate.toISOString().split('T')[0], // Convert Date to string
        dateOfBirth: studentData.dateOfBirth.toISOString().split('T')[0], // Convert Date to string
    };

    const hashedPassword = await bcrypt.hash(studentData.password, 10);
    await db.insert(studentTable).values({
        ...sanitizedStudentData,
        password: hashedPassword,
    }).execute();
};

export const getStudentById = async (id: number): Promise<Student | null> => {
    try {
        const result = await db
            .select({
                id: studentTable.id,
                firstName: studentTable.firstName,
                admissionNumber: studentTable.admissionNumber,
                lastName: studentTable.lastName,
                admissionDate: studentTable.admissionDate,
                rollNumber: studentTable.rollNumber,
                class: studentTable.class,
                section: studentTable.section,
                gender: studentTable.gender,
                religionStatus: studentTable.religionStatus,
                emailAddress: studentTable.emailAddress,
                motherTongue: studentTable.motherTongue,
                languagesKnown: studentTable.languagesKnown,
                dateOfBirth: studentTable.dateOfBirth,
                image: studentTable.image,
                password: studentTable.password,
                bloodGroup: studentTable.bloodGroup,
                createdAt: studentTable.createdAt,
                updatedAt: studentTable.updatedAt,
            })
            .from(studentTable)
            .where(eq(studentTable.id, id))
            .limit(1)
            .execute();

        if (result.length === 0) {
            console.warn(`⚠️ No student found with ID: ${id}`);
            return null;
        }

        const item = result[0];
        return {
            ...item,
            admissionDate: item.admissionDate ? new Date(item.admissionDate) : null, // Convert to Date
            dateOfBirth: item.dateOfBirth ? new Date(item.dateOfBirth) : null, // Convert to Date
            createdAt: item.createdAt ? new Date(item.createdAt) : null, // Convert to Date
            updatedAt: item.updatedAt ? new Date(item.updatedAt) : null, // Convert to Date
        } as Student;
    } catch (error) {
        console.error(`❌ Error fetching student by ID (${id}):`, error);
        throw new Error('Error fetching student from database');
    }
};

export const getAllStudents = async (): Promise<Student[]> => {
    try {
        const result = await db
            .select({
                id: studentTable.id,
                firstName: studentTable.firstName,
                admissionNumber: studentTable.admissionNumber,
                lastName: studentTable.lastName,
                admissionDate: studentTable.admissionDate,
                rollNumber: studentTable.rollNumber,
                class: studentTable.class,
                section: studentTable.section,
                gender: studentTable.gender,
                religionStatus: studentTable.religionStatus,
                emailAddress: studentTable.emailAddress,
                motherTongue: studentTable.motherTongue,
                languagesKnown: studentTable.languagesKnown,
                dateOfBirth: studentTable.dateOfBirth,
                image: studentTable.image,
                password: studentTable.password,
                bloodGroup: studentTable.bloodGroup,
                createdAt: studentTable.createdAt,
                updatedAt: studentTable.updatedAt,
            })
            .from(studentTable)
            .execute();

        return result.map(item => ({
            ...item,
            admissionDate: item.admissionDate ? new Date(item.admissionDate) : null, // Convert to Date
            dateOfBirth: item.dateOfBirth ? new Date(item.dateOfBirth) : null, // Convert to Date
            createdAt: item.createdAt ? new Date(item.createdAt) : null, // Convert to Date
            updatedAt: item.updatedAt ? new Date(item.updatedAt) : null, // Convert to Date
        })) as Student[];
    } catch (error) {
        console.error('❌ Error fetching students:', error);
        throw new Error('Error fetching students from database');
    }
};

export const getStudentByAdmissionNumber = async (admissionNumber: string): Promise<Student | null> => {
    try {
        const result = await db
            .select({
                id: studentTable.id,
                firstName: studentTable.firstName,
                admissionNumber: studentTable.admissionNumber,
                lastName: studentTable.lastName,
                admissionDate: studentTable.admissionDate,
                rollNumber: studentTable.rollNumber,
                class: studentTable.class,
                section: studentTable.section,
                gender: studentTable.gender,
                religionStatus: studentTable.religionStatus,
                emailAddress: studentTable.emailAddress,
                motherTongue: studentTable.motherTongue,
                languagesKnown: studentTable.languagesKnown,
                dateOfBirth: studentTable.dateOfBirth,
                image: studentTable.image,
                password: studentTable.password,
                bloodGroup: studentTable.bloodGroup,
                createdAt: studentTable.createdAt,
                updatedAt: studentTable.updatedAt,
            })
            .from(studentTable)
            .where(eq(studentTable.admissionNumber, admissionNumber))
            .limit(1)
            .execute();

        if (result.length === 0) {
            console.warn(`⚠️ No student found with admission number: ${admissionNumber}`);
            return null;
        }

        const item = result[0];
        return {
            ...item,
            admissionDate: item.admissionDate ? new Date(item.admissionDate) : null, // Convert to Date
            dateOfBirth: item.dateOfBirth ? new Date(item.dateOfBirth) : null, // Convert to Date
            createdAt: item.createdAt ? new Date(item.createdAt) : null, // Convert to Date
            updatedAt: item.updatedAt ? new Date(item.updatedAt) : null, // Convert to Date
        } as Student;
    } catch (error) {
        console.error(`❌ Error fetching student by admission number (${admissionNumber}):`, error);
        throw new Error('Error fetching student from database');
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

export const loginStudent = async (admissionNumber: string, password: string): Promise<Student | null> => {
    const student = await getStudentByAdmissionNumber(admissionNumber);
    if (!student) {
        return null;
    }

    const isPasswordValid = await comparePassword(password, student.password);
    if (!isPasswordValid) {
        return null;
    }

    return student;
};
