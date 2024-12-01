// backend/controllers/registerController.ts
import { Request, Response, NextFunction } from 'express';
import { createFinanceEntry } from '../models/financeRegistrarModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateIdFinance } from '../utils/generateId';
import { usersTable, rolesTable } from '../db/tables';
import { db } from '../config/dbConfig';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import { MulterFile } from '../types/multerFile';
const deleteUploadedFiles = (files: MulterFile[]) => {
    files.forEach(file => {
        fs.unlink(file.path, (err) => {
            if (err) {
                console.error(`❌ Error deleting file ${file.path}:`, err);
            }
        });
    });
};
const parseDate = (date: string) => {
    return date && date.toLowerCase() !== 'null' ? date : null;
};
export const registerFinanceRegistrar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const files = req.files as Record<string, MulterFile[]>;
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            if (files) deleteUploadedFiles(Object.values(files).flat());
            res.status(403).json({ message: 'No token provided, authorization denied' });
            return;
        }
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7, authHeader.length) : authHeader;
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            req.body.adminId = (decoded as any).id;
        } catch (error: any) {
            if (files) deleteUploadedFiles(Object.values(files).flat());
            res.status(500).json({ message: 'Failed to authenticate token', error: error.message });
            return;
        }
        const {
            firstName, lastName, primaryContactNumber, emailAddress, bloodGroup, dateOfJoining,
            fathersName, mothersName, dateOfBirth, maritalStatus, languagesKnown, qualification,
            workExperience, previousWork, previousWorkAddress, previousWorkPhoneNumber, address,
            permanentAddress, panNumber, epfNumber, basicSalary, contractType, workShift, workLocation,
            dateOfLeaving, medicalLeaves, casualLeaves, maternityLeaves, sickLeaves, accountName,
            accountNumber, bankName, ifscCode, facebook, instagram, linkedin, youtube, twitterUrl,
            password, confirmPassword
        } = req.body;
        const registrarId = generateIdFinance();
        const hashedPassword = await bcrypt.hash(password, 10);
        const roleQuery = await db.select().from(rolesTable).where(eq(rolesTable.role_name, 'finance')).limit(1);
        if (roleQuery.length === 0) {
            if (files) deleteUploadedFiles(Object.values(files).flat());
            res.status(500).json({ message: 'Finance role not found. Ensure the "rolesTable" has an entry for "finance".' });
            return;
        }
        const roleId = roleQuery[0].id;
        const newFinanceEntry = {
            firstName,
            registrarId,
            lastName,
            primaryContactNumber,
            emailAddress,
            bloodGroup,
            image: files.image?.[0]?.path,
            dateOfJoining,
            gender: req.body.gender,
            fathersName,
            mothersName,
            dateOfBirth,
            maritalStatus,
            languagesKnown,
            qualification,
            workExperience,
            previousWork,
            previousWorkAddress,
            previousWorkPhoneNumber,
            address,
            permanentAddress,
            panNumber,
            epfNumber,
            basicSalary,
            contractType,
            workShift,
            workLocation,
            dateOfLeaving: parseDate(dateOfLeaving), // Use parseDate function
            medicalLeaves,
            casualLeaves,
            maternityLeaves,
            sickLeaves,
            accountName,
            accountNumber,
            bankName,
            ifscCode,
            facebook,
            instagram,
            linkedin,
            youtube,
            twitterUrl,
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
        // Generate JWT token for the new finance registrar
        const financeToken = jwt.sign(
            { id: registrarId, username: emailAddress, role: 'finance' },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );
        res.status(201).json({ message: 'Finance Registrar created successfully', token: financeToken, user: newUser});
    } catch (error: any) {
        if (files) deleteUploadedFiles(Object.values(files).flat());
        res.status(500).json({ message: 'Error creating Finance Registrar', error: error.message || error });
    }
};