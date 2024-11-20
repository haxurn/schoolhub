// backend/utils/generateStudentId.ts

import { db } from '../config/db';
import { students } from '../models/studentModel';
import { eq } from "drizzle-orm";
export const generateUniqueStudentId = async (): Promise<string> => {
    let studentIdNumber: string = "";
    let isUnique = false;

    while (!isUnique) {
        
        studentIdNumber = Math.floor(Math.random() * 1000000).toString().padStart(8, '0');

        
        const existingStudent = await db
            .select()
            .from(students)
            .where(eq(students.studentIdNumber, studentIdNumber))  
            .limit(1)
            .execute();

        
        if (existingStudent.length === 0) {
            isUnique = true;
        }
    }

    return studentIdNumber;  
};
