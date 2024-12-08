import { db } from '../config/dbConfig';
import { eq } from 'drizzle-orm';
import { studentTable } from '../db/tables';
import bcrypt from 'bcrypt';

interface Student {
    id: number;
    firstName: string;
    admissionNumber: string;
    lastName: string;
    admissionDate: string;
    rollNumber?: string;
    class: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | 'k-1' | 'k-2' | 'k-3';
    section?: string;
    gender: 'Male' | 'Female' | 'Other';
    religionStatus: 'Christian' | 'Muslim' | 'Other';
    emailAddress: string;
    motherTongue: string;
    languagesKnown: string;
    dateOfBirth: string;
    image: string;
    password: string;
    bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    createdAt: Date | null;
    updatedAt: Date | null;
}


// Create a new student
export const createStudent = async (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    const sanitizedStudentData = {
        ...studentData,
        admissionDate: studentData.admissionDate || '',
        dateOfBirth: studentData.dateOfBirth || '',
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
            .select()
            .from(studentTable)
            .where(eq(studentTable.id, id))
            .limit(1)
            .execute();

        if (result.length === 0) {
            console.warn(`⚠️ No student found with ID: ${id}`);
            return null;
        }

        const item = result[0];
        return mapStudentResult(item);
    } catch (error) {
        console.error(`❌ Error fetching student by ID (${id}):`, error);
        throw new Error('Error fetching student from database');
    }
};


export const getAllStudents = async (): Promise<Student[]> => {
    try {
        const result = await db.select().from(studentTable).execute();

        return result.map(mapStudentResult);
    } catch (error) {
        console.error('❌ Error fetching students:', error);
        throw new Error('Error fetching students from database');
    }
};


export const getStudentByAdmissionNumber = async (admissionNumber: string): Promise<Student | null> => {
    try {
        const result = await db
            .select()
            .from(studentTable)
            .where(eq(studentTable.admissionNumber, admissionNumber))
            .limit(1)
            .execute();

        if (result.length === 0) {
            console.warn(`⚠️ No student found with admission number: ${admissionNumber}`);
            return null;
        }

        return mapStudentResult(result[0]);
    } catch (error) {
        console.error(`❌ Error fetching student by admission number (${admissionNumber}):`, error);
        throw new Error('Error fetching student from database');
    }
};

// Compare passwords
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        console.error('❌ Error comparing passwords:', error);
        throw new Error('Error comparing passwords');
    }
};

// Log in a student
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

// Helper: Map database result to Student object
const mapStudentResult = (item: any): Student => ({
    ...item,
    admissionDate: item.admissionDate ? item.admissionDate : null,
    dateOfBirth: item.dateOfBirth ? item.dateOfBirth : null,
    createdAt: item.createdAt ? new Date(item.createdAt) : null,
    updatedAt: item.updatedAt ? new Date(item.updatedAt) : null,
});
