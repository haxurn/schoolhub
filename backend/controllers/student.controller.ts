// backend/controllers/student.controller.ts

import { Request, Response } from 'express';
import { createStudent } from '../services/student.service';
import { Student, Document  } from '../schema/';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.utils';

export const createStudentController = async (req: Request, res: Response) => {
    const { student, documents }: { student: Student, documents: Document[] } = req.body;

    try {
        const createdStudent = await createStudent(student, documents);


        const accessToken = generateAccessToken({ userId: createdStudent.userId });
        const refreshToken = generateRefreshToken({ userId: createdStudent.userId });

        res.status(201).json({
            message: "Student created successfully!",
            data: {
                student: createdStudent,
                tokens: {
                    accessToken,
                    refreshToken
                }
            },
        });
    } catch (error: unknown) {
        console.error("Error creating student:", error);

        if (error instanceof Error) {
            console.error(error.message);
        }
        
        res.status(500).json({
            message: "Error creating student!",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
