// backend/controllers/studentController.ts

import { Request, Response, NextFunction } from 'express';
import { db } from '../config/dbConfig';
import { studentTable, documentTable, medicalHistoryTable, previousSchoolTable, siblingsTable, parentsTable, guardiansTable } from '../db/tables';
import { admissionNumberGenerator } from '../utils/generateId';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { MulterFile } from '../types/multerFile';
import fs from 'fs';
import path from 'path';






const UPLOAD_DIR = path.resolve(__dirname, '../uploads');

const deleteUploadedFiles = (files: MulterFile[]) => {
    files.forEach(file => {
       
        const safeFilePath = path.join(UPLOAD_DIR, path.basename(file.path));

        
        if (!safeFilePath.startsWith(UPLOAD_DIR)) {
            console.error(`❌ Security Error: Invalid file path detected: ${file.path}`);
            return;
        }
        fs.unlink(safeFilePath, (err) => {
            if (err) {
                console.error(`❌ Error deleting file ${safeFilePath}:`, err);
            } else {
                console.log(`✅ File deleted successfully: ${safeFilePath}`);
            }
        });
    });

};


export const registerStudent = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
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
            // Basic Information
            firstName,
            lastName,
            dateOfBirth,
            gender,
            bloodGroup,
            religionStatus,
            emailAddress,
            motherTongue,
            languagesKnown,
            class: studentClass,
            section,
            admissionDate,
            rollNumber,

            // Parent Information
            fatherName,
            fatherEmail,
            fatherPhone,
            fatherOccupation,
            motherName,
            motherEmail,
            motherPhone,
            motherOccupation,
            parentPassword,

            // Guardian Information
            guardianType,
            guardianName,
            guardianRelation,
            guardianPhone,
            guardianEmail,
            guardianOccupation,
            guardianAddress,

            // Medical Information
            allergies,
            medicalCondition,
            medications,

            // Previous School Information
            previousSchoolName,
            previousSchoolAddress,

            // Sibling Information
            isSiblingStudyingInSameSchool,
            siblingName,
            siblingRollNo,
            siblingAdmissionNo,
            siblingClass,

            // Account Information
            password
        } = req.body;

        // Generate admission number
        const admissionNumber = admissionNumberGenerator();
        
        // Hash passwords
        const hashedStudentPassword = await bcrypt.hash(password, 10);
        const hashedParentPassword = await bcrypt.hash(parentPassword, 10);

        // Start a transaction
        await db.transaction(async (tx) => {
            // Create student entry
            const studentResult = await tx.insert(studentTable).values({
                firstName,
                lastName,
                admissionNumber,
                admissionDate,
                rollNumber,
                class: studentClass,
                section,
                gender,
                religionStatus,
                emailAddress,
                motherTongue,
                languagesKnown,
                dateOfBirth,
                image: files.studentImage?.[0]?.path || '',
                password: hashedStudentPassword,
                bloodGroup,
            }).returning({ id: studentTable.id });

            const studentId = studentResult[0].id;

            // Create document entries
            if (files.documents) {
                await tx.insert(documentTable).values({
                    studentId,
                    documentType: 'Student Documents',
                    document: files.documents[0].path,
                });
            }

            // Create medical history entry
            await tx.insert(medicalHistoryTable).values({
                studentId,
                allergies,
                medicalCondition,
                medications,
            });

            // Create previous school entry
            await tx.insert(previousSchoolTable).values({
                studentId,
                schoolName: previousSchoolName,
                address: previousSchoolAddress,
            });

            // Create sibling entry if applicable
            if (isSiblingStudyingInSameSchool === 'Yes') {
                await tx.insert(siblingsTable).values({
                    studentId,
                    isSiblingStudyingInSameSchool,
                    siblingName,
                    siblingRollNo,
                    siblingAdmissionNo,
                    siblingClass,
                });
            }

            // Create parents entry
            await tx.insert(parentsTable).values({
                studentId,
                fatherName,
                fatherEmail,
                fatherPhone,
                fatherOccupation,
                fatherUpload: files.fatherDocument?.[0]?.path,
                motherName,
                motherEmail,
                motherPhone,
                motherOccupation,
                motherUpload: files.motherDocument?.[0]?.path,
                password: hashedParentPassword,
            });

            // Create guardian entry if applicable
            if (guardianType) {
                await tx.insert(guardiansTable).values({
                    studentId,
                    guardianType,
                    guardianName,
                    guardianRelation,
                    guardianPhone,
                    guardianEmail,
                    guardianOccupation,
                    guardianAddress,
                    guardianUpload: files.guardianDocument?.[0]?.path,
                });
            }
        });

        res.status(201).json({
            message: 'Student registered successfully',
            admissionNumber
        });
    } catch (error: any) {
        if (files) deleteUploadedFiles(Object.values(files).flat());
        console.error('❌ Error registering student:', error);
        res.status(500).json({
            message: 'Failed to register student',
            error: error.message || error
        });
    }
};
