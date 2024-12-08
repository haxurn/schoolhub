// backend/routes/student/registerRoutes.ts

import express from 'express';
import { registerStudent } from '../../controllers/studentController';
import { upload } from '../../middleware/uploadMiddleware';
import { adminOrFinance } from '../../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * /student/register:
 *   post:
 *     tags: [Student]
 *     summary: Register a new student
 *     description: Register a new student with their complete profile including parents, guardians, medical history, and documents. Requires either admin or finance role.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - dateOfBirth
 *               - gender
 *               - bloodGroup
 *               - religionStatus
 *               - emailAddress
 *               - motherTongue
 *               - languagesKnown
 *               - class
 *               - section
 *               - admissionDate
 *               - rollNumber
 *               - fatherName
 *               - fatherEmail
 *               - fatherPhone
 *               - fatherOccupation
 *               - motherName
 *               - motherEmail
 *               - motherPhone
 *               - motherOccupation
 *               - parentPassword
 *               - previousSchoolName
 *               - previousSchoolAddress
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *               bloodGroup:
 *                 type: string
 *                 enum: [A+, A-, B+, B-, AB+, AB-, O+, O-]
 *               religionStatus:
 *                 type: string
 *                 enum: [Christian, Muslim, Other]
 *               emailAddress:
 *                 type: string
 *                 format: email
 *               motherTongue:
 *                 type: string
 *               languagesKnown:
 *                 type: string
 *               class:
 *                 type: string
 *                 enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
 *               section:
 *                 type: string
 *                 enum: [A, B, C, D, E]
 *               admissionDate:
 *                 type: string
 *                 format: date
 *               rollNumber:
 *                 type: string
 *               fatherName:
 *                 type: string
 *               fatherEmail:
 *                 type: string
 *                 format: email
 *               fatherPhone:
 *                 type: string
 *               fatherOccupation:
 *                 type: string
 *               motherName:
 *                 type: string
 *               motherEmail:
 *                 type: string
 *                 format: email
 *               motherPhone:
 *                 type: string
 *               motherOccupation:
 *                 type: string
 *               parentPassword:
 *                 type: string
 *                 format: password
 *               guardianType:
 *                 type: string
 *                 enum: [Legal Guardian, Relative, Other]
 *               guardianName:
 *                 type: string
 *               guardianRelation:
 *                 type: string
 *               guardianPhone:
 *                 type: string
 *               guardianEmail:
 *                 type: string
 *                 format: email
 *               guardianOccupation:
 *                 type: string
 *               guardianAddress:
 *                 type: string
 *               allergies:
 *                 type: string
 *               medicalCondition:
 *                 type: string
 *               medications:
 *                 type: string
 *               previousSchoolName:
 *                 type: string
 *               previousSchoolAddress:
 *                 type: string
 *               isSiblingStudyingInSameSchool:
 *                 type: string
 *                 enum: [Yes, No]
 *               siblingName:
 *                 type: string
 *               siblingRollNo:
 *                 type: string
 *               siblingAdmissionNo:
 *                 type: string
 *               siblingClass:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               studentImage:
 *                 type: string
 *                 format: binary
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               fatherDocument:
 *                 type: string
 *                 format: binary
 *               motherDocument:
 *                 type: string
 *                 format: binary
 *               guardianDocument:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Student registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 admissionNumber:
 *                   type: string
 *       400:
 *         description: Bad request - invalid input data
 *       401:
 *         description: Unauthorized - invalid token
 *       403:
 *         description: Forbidden - no token provided or insufficient permissions
 *       500:
 *         description: Server error
 */
router.post(
    '/register',
    adminOrFinance,
    upload.fields([
        { name: 'studentImage', maxCount: 1 },
        { name: 'documents', maxCount: 5 },
        { name: 'fatherDocument', maxCount: 1 },
        { name: 'motherDocument', maxCount: 1 },
        { name: 'guardianDocument', maxCount: 1 }
    ]) as express.RequestHandler,
    registerStudent
);

export default router;