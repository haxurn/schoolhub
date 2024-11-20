import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/db';
import { students } from '../models/studentModel';
import { parents } from '../models/studentModel'; 
import { studentRegistrationSchema } from '../schemas/studentRegistrationSchema';
import { generateUniqueStudentId } from '../utils/generateStudentId';
import { generatePassword } from "../utils/generatePassword";
import * as dotenv from 'dotenv';
import { eq } from "drizzle-orm";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
}

// Register Student Handler
export const registerStudent = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate incoming data using the schema
        const validatedData = studentRegistrationSchema.parse(req.body);

        const studentPassword = generatePassword(12);
        const fatherPassword = generatePassword(12);
        const motherPassword = generatePassword(12);

        // Hash passwords
        const hashedStudentPassword = await bcrypt.hash(studentPassword, 10);
        const hashedFatherPassword = await bcrypt.hash(fatherPassword, 10);
        const hashedMotherPassword = await bcrypt.hash(motherPassword, 10);

        const studentIdNumber = String(await generateUniqueStudentId());

        const studentData = validatedData;

        const newStudent = {
            studentIdNumber,
            fullName: studentData.fullName,
            gender: studentData.gender,
            previousGradeCertificate: studentData.previousGradeCertificate,
            birthdate: studentData.birthdate,
            age: studentData.age,
            bloodType: studentData.bloodType,
            applyingGrade: studentData.applyingGrade,
            address: studentData.address,
            parentInfo: studentData.parentInfo,
            nationality: studentData.nationality,
            password: hashedStudentPassword,
        };

        const newFather = {
            fullName: studentData.parentInfo.father.fullName,
            email: studentData.parentInfo.father.email,
            phoneNumber: studentData.parentInfo.father.phoneNumber,
            job: studentData.parentInfo.father.job || "",
            workplaceAddress: studentData.parentInfo.father.workplaceAddress || "",
            photo: studentData.parentInfo.father.photo || "",
            nationality: studentData.parentInfo.father.nationality || "Ethiopian",
            password: hashedFatherPassword,
            studentId: Number(studentIdNumber),
        };

        const newMother = {
            fullName: studentData.parentInfo.mother.fullName,
            email: studentData.parentInfo.mother.email,
            phoneNumber: studentData.parentInfo.mother.phoneNumber,
            job: studentData.parentInfo.mother.job || "",
            workplaceAddress: studentData.parentInfo.mother.workplaceAddress || "",
            photo: studentData.parentInfo.mother.photo || "",
            nationality: studentData.parentInfo.mother.nationality || "Ethiopian",
            password: hashedMotherPassword,
            studentId: Number(studentIdNumber),
        };

        // Insert data into the database
        const [insertedStudent] = await db
            .insert(students)
            .values(newStudent)
            .returning({
                id: students.id,
                fullName: students.fullName,
                studentIdNumber: students.studentIdNumber,
            });

        await db.insert(parents).values(newFather);
        await db.insert(parents).values(newMother);

        res.status(201).json({
            message: "Student and parents registered successfully.",
            student: {
                id: insertedStudent.id,
                fullName: insertedStudent.fullName,
                studentIdNumber: insertedStudent.studentIdNumber,
                password: studentPassword,  // Send plain password for testing
            },
            father: {
                fullName: newFather.fullName,
                email: newFather.email,
                password: fatherPassword,  // Send plain password for testing
            },
            mother: {
                fullName: newMother.fullName,
                email: newMother.email,
                password: motherPassword,  // Send plain password for testing
            },
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            message: "An error occurred during registration.",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

/// Login Student Handler
export const loginStudent = async (req: Request, res: Response): Promise<> => {
    try {
        const { studentIdNumber, password } = req.body;

        // Fetch student from the database
        const student = await db
            .select()
            .from(students)
            .where(eq(students.studentIdNumber, studentIdNumber))
            .limit(1)
            .then((result) => result[0]);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' }); // Added return to exit the function after sending response
        }

        const isPasswordCorrect = await bcrypt.compare(password, student.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid credentials' }); // Added return to exit the function after sending response
        }

        const token = jwt.sign({ studentId: student.id }, JWT_SECRET!, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: 'An error occurred during login.',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
