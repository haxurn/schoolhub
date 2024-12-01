import { Request, Response, NextFunction } from 'express';
import { createFinanceEntry } from '../models/financeRegistrarModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateId } from '../utils/generateId';
import { usersTable, rolesTable } from '../db/tables';
import { db } from '../config/dbConfig';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import { MulterFile } from '../types/multerFile';
import path from 'path';
import { z } from 'zod';

const BASE_UPLOAD_DIR = path.resolve(__dirname, '../uploads');

// Function to delete uploaded files
const deleteUploadedFiles = (files: MulterFile[]) => {
    files.forEach(file => {
        const resolvedPath = path.resolve(BASE_UPLOAD_DIR, file.path);

        if (!resolvedPath.startsWith(BASE_UPLOAD_DIR)) {
            console.error(`❌ Invalid file path detected: ${file.path}`);
            return;
        }

        const safePath = resolvedPath.replace(/[^a-zA-Z0-9.\-_\/\\]/g, '');
        fs.unlink(safePath, (err) => {
            if (err) {
                console.error(`❌ Error deleting file: ${safePath}`, err);
            } else {
                console.log(`✅ Successfully deleted file: ${safePath}`);
            }
        });
    });
};

// Function to parse date
const parseDate = (date: unknown): string | null => {
    if (typeof date !== 'string' || date.toLowerCase() === 'null') return null;
    return date;
};

// Zod schema for input validation
const financeRegistrarSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    primaryContactNumber: z.string(),
    emailAddress: z.string().email(),
    bloodGroup: z.string().optional(),
    dateOfJoining: z.string().optional(),
    fathersName: z.string().optional(),
    mothersName: z.string().optional(),
    dateOfBirth: z.string().optional(),
    maritalStatus: z.string().optional(),
    languagesKnown: z.string().optional(),
    qualification: z.string().optional(),
    workExperience: z.string().optional(),
    previousWork: z.string().optional(),
    previousWorkAddress: z.string().optional(),
    previousWorkPhoneNumber: z.string().optional(),
    address: z.string(),
    permanentAddress: z.string().optional(),
    panNumber: z.string().optional(),
    epfNumber: z.string().optional(),
    basicSalary: z.number(),
    contractType: z.string(),
    workShift: z.string(),
    workLocation: z.string(),
    dateOfLeaving: z.string().optional(),
    medicalLeaves: z.number().optional(),
    casualLeaves: z.number().optional(),
    maternityLeaves: z.number().optional(),
    sickLeaves: z.number().optional(),
    accountName: z.string(),
    accountNumber: z.string(),
    bankName: z.string(),
    ifscCode: z.string(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    youtube: z.string().optional(),
    twitterUrl: z.string().optional(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
});

export const registerFinanceRegistrar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const files = req.files as Record<string, MulterFile[]>;

    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            if (files) deleteUploadedFiles(Object.values(files).flat());
            res.status(403).json({ message: 'No token provided, authorization denied' });
            return;
        }

        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

        const secretKey = process.env.JWT_SECRET ?? (() => {
            throw new Error('JWT_SECRET is not defined');
        })();

        let decoded;
        try {
            decoded = jwt.verify(token, secretKey);
            req.body.adminId = (decoded as any).id;
        } catch (error: any) {
            if (files) deleteUploadedFiles(Object.values(files).flat());
            res.status(500).json({ message: 'Failed to authenticate token', error: error.message });
            return;
        }

        // Validate request body using Zod
        const validatedBody = financeRegistrarSchema.parse(req.body);

        if (validatedBody.password !== validatedBody.confirmPassword) {
            res.status(400).json({ message: 'Passwords do not match' });
            return;
        }

        const registrarId = generateId();
        const hashedPassword = await bcrypt.hash(validatedBody.password, 10);

        const roleQuery = await db.select().from(rolesTable).where(eq(rolesTable.role_name, 'finance')).limit(1);
        if (roleQuery.length === 0) {
            if (files) deleteUploadedFiles(Object.values(files).flat());
            res.status(500).json({ message: 'Finance role not found. Ensure the "rolesTable" has an entry for "finance".' });
            return;
        }
        const roleId = roleQuery[0].id;

        const newFinanceEntry = {
            ...validatedBody,
            registrarId,
            image: files.image?.[0]?.path,
            resume: files.resume?.[0]?.path,
            joiningLetter: files.joiningLetter?.[0]?.path,
            personalDocs: files.personalDocs?.[0]?.path,
            password: hashedPassword,
            role_id: roleId,
        };

        const newUser = {
            username: registrarId,
            password: hashedPassword,
            role_id: roleId,
        };

        await db.transaction(async trx => {
            await createFinanceEntry(newFinanceEntry);
            await trx.insert(usersTable).values(newUser).execute();
        });

        const financeToken = jwt.sign(
            { id: registrarId, username: validatedBody.emailAddress, role: 'finance' },
            secretKey,
            { expiresIn: '1h' }
        );

        res.status(201).json({ message: 'Finance Registrar created successfully', token: financeToken });
    } catch (error: any) {
        if (files) deleteUploadedFiles(Object.values(files).flat());
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: 'Validation error', errors: error.errors });
        } else {
            res.status(500).json({ message: 'Error creating Finance Registrar', error: error.message || error });
        }
    }
};
