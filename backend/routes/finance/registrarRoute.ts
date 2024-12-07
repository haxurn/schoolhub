// backend/routes/finance/registrarRoute.ts

import express, { RequestHandler } from 'express';
import { registerFinanceRegistrar } from '../../controllers/registerController';
import { upload } from '../../middleware/fileUploadMiddleware'; 
import { adminOnly } from '../../middleware/authMiddleware';
import { validateFinanceRegistrarData } from '../../middleware/validationMiddleware';

const router = express.Router();

const registerHandler: RequestHandler = async (req, res, next) => {
    try {
        await registerFinanceRegistrar(req, res, next);
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * tags:
 *   name: Finance Staff Management
 *   description: Finance staff registration and management endpoints
 * 
 * components:
 *   schemas:
 *     FinanceRegistrarPersonalInfo:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - emailAddress
 *         - primaryContactNumber
 *       properties:
 *         firstName:
 *           type: string
 *           example: "John"
 *           description: First name of the finance staff
 *         lastName:
 *           type: string
 *           example: "Doe"
 *           description: Last name of the finance staff
 *         emailAddress:
 *           type: string
 *           format: email
 *           example: "john.doe@school.com"
 *           description: Official email address
 *         primaryContactNumber:
 *           type: string
 *           example: "+1234567890"
 *           description: Primary contact number
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: "1990-01-01"
 *         gender:
 *           type: string
 *           enum: [Male, Female, Other]
 *         maritalStatus:
 *           type: string
 *           enum: [Single, Married, Divorced, Widowed]
 *     
 *     FinanceRegistrarProfessionalInfo:
 *       type: object
 *       required:
 *         - qualification
 *         - dateOfJoining
 *         - contractType
 *       properties:
 *         qualification:
 *           type: string
 *           example: "MBA Finance"
 *         workExperience:
 *           type: integer
 *           minimum: 0
 *           example: 5
 *         dateOfJoining:
 *           type: string
 *           format: date
 *           example: "2024-01-15"
 *         contractType:
 *           type: string
 *           enum: [Full-time, Part-time, Contract]
 *         workShift:
 *           type: string
 *           enum: [Morning, Evening, Night]
 *         workLocation:
 *           type: string
 *           example: "Main Campus"
 *     
 *     FinanceRegistrarEmploymentInfo:
 *       type: object
 *       required:
 *         - basicSalary
 *         - panNumber
 *       properties:
 *         basicSalary:
 *           type: number
 *           format: float
 *           example: 50000
 *         panNumber:
 *           type: string
 *           example: "ABCDE1234F"
 *         epfNumber:
 *           type: string
 *           example: "EP123456789"
 *         leaves:
 *           type: object
 *           properties:
 *             medical:
 *               type: integer
 *               example: 12
 *             casual:
 *               type: integer
 *               example: 12
 *             sick:
 *               type: integer
 *               example: 7
 *     
 *     FinanceRegistrarBankInfo:
 *       type: object
 *       required:
 *         - accountName
 *         - accountNumber
 *         - bankName
 *         - ifscCode
 *       properties:
 *         accountName:
 *           type: string
 *           example: "John Doe"
 *         accountNumber:
 *           type: string
 *           example: "1234567890"
 *         bankName:
 *           type: string
 *           example: "State Bank"
 *         ifscCode:
 *           type: string
 *           example: "ABCD0123456"
 *     
 *     FinanceRegistrarResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Finance staff registered successfully"
 *         staffId:
 *           type: string
 *           example: "FIN2024001"
 *         details:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: "John Doe"
 *             email:
 *               type: string
 *               example: "john.doe@school.com"
 *             role:
 *               type: string
 *               example: "finance"
 *             joiningDate:
 *               type: string
 *               format: date
 *               example: "2024-01-15"
 */

/**
 * @swagger
 * /api/finance/register:
 *   post:
 *     summary: Register new finance staff
 *     tags: [Finance Staff Management]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Register a new finance staff member. This endpoint requires admin authorization.
 *       
 *       Required documents to be uploaded:
 *       - Profile image (JPEG/PNG, max 2MB)
 *       - Resume (PDF, max 5MB)
 *       - Joining letter (PDF, max 2MB)
 *       - Personal documents (PDF, max 10MB)
 *       
 *       All personal and professional details must be provided in the form data.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - personalInfo
 *               - professionalInfo
 *               - employmentInfo
 *               - bankInfo
 *               - image
 *               - resume
 *               - joiningLetter
 *             properties:
 *               personalInfo:
 *                 $ref: '#/components/schemas/FinanceRegistrarPersonalInfo'
 *               professionalInfo:
 *                 $ref: '#/components/schemas/FinanceRegistrarProfessionalInfo'
 *               employmentInfo:
 *                 $ref: '#/components/schemas/FinanceRegistrarEmploymentInfo'
 *               bankInfo:
 *                 $ref: '#/components/schemas/FinanceRegistrarBankInfo'
 *               image:
 *                 type: string
 *                 format: binary
 *               resume:
 *                 type: string
 *                 format: binary
 *               joiningLetter:
 *                 type: string
 *                 format: binary
 *               personalDocs:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Finance staff registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FinanceRegistrarResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Requires admin access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflict - Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       413:
 *         description: Payload too large - Document size exceeds limit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       415:
 *         description: Unsupported media type for documents
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
    '/register',
    adminOnly,
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'resume', maxCount: 1 },
        { name: 'joiningLetter', maxCount: 1 },
        { name: 'personalDocs', maxCount: 1 }
    ]),
    validateFinanceRegistrarData,
    registerHandler
);

export default router;