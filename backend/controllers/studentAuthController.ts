// backend/controllers/studentAuthController.ts

import { Request, Response } from 'express';
import { db } from '../config/dbConfig';
import { studentTable } from '../db/tables';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRole } from '../middleware/roles';

export const loginStudent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { admissionNumber, password } = req.body;

        if (!admissionNumber || !password) {
            res.status(400).json({ message: 'Please provide admission number and password' });
            return;
        }

        // Find student by admission number
        const student = await db.select()
            .from(studentTable)
            .where(eq(studentTable.admissionNumber, admissionNumber))
            .limit(1);

        if (student.length === 0) {
            res.status(401).json({ message: 'Invalid admission number or password' });
            return;
        }

        // Check password
        const validPassword = await bcrypt.compare(password, student[0].password);
        if (!validPassword) {
            res.status(401).json({ message: 'Invalid admission number or password' });
            return;
        }

        // Create JWT token
        const token = jwt.sign(
            {
                id: student[0].id,
                role: UserRole.STUDENT,
                email: student[0].emailAddress,
                admissionNumber: student[0].admissionNumber,
                name: `${student[0].firstName} ${student[0].lastName}`
            },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        // Send response
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: student[0].id,
                admissionNumber: student[0].admissionNumber,
                firstName: student[0].firstName,
                lastName: student[0].lastName,
                email: student[0].emailAddress,
                class: student[0].class,
                section: student[0].section,
                role: UserRole.STUDENT
            }
        });
    } catch (error) {
        console.error('❌ Error in student login:', error);
        res.status(500).json({ message: 'Server error during login' });
        return;
    }
};
