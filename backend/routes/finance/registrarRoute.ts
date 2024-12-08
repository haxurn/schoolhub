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
 *         - dateOfBirth
 *         - fathersName
 *         - mothersName
 *         - maritalStatus
 *         - bloodGroup
 *       properties:
 *         firstName:
 *           type: string
 *           minLength: 2
 *           example: "John"
 *           description: First name of the finance staff (minimum 2 characters)
 *         lastName:
 *           type: string
 *           minLength: 2
 *           example: "Doe"
 *           description: Last name of the finance staff (minimum 2 characters)
 *         emailAddress:
 *           type: string
 *           format: email
 *           example: "john.doe@school.com"
 *           description: Official email address
 *         primaryContactNumber:
 *           type: string
 *           pattern: "^\\+?[1-9]\\d{9,14}$"
 *           example: "+1234567890"
 *           description: Primary contact number (international format)
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           pattern: "^\\d{4}-\\d{2}-\\d{2}$"
 *           example: "1990-01-01"
 *           description: Date of birth in YYYY-MM-DD format
 *         fathersName:
 *           type: string
 *           minLength: 2
 *           example: "James Doe"
 *           description: Father's name (minimum 2 characters)
 *         mothersName:
 *           type: string
 *           minLength: 2
 *           example: "Jane Doe"
 *           description: Mother's name (minimum 2 characters)
 *         bloodGroup:
 *           type: string
 *           enum: [A+, A-, B+, B-, AB+, AB-, O+, O-]
 *           example: "O+"
 *           description: Blood group of the staff member
 *         maritalStatus:
 *           type: string
 *           enum: [Single, Married, Divorced, Widowed]
 *           example: "Single"
 *           description: Marital status of the staff member
 *     
 *     FinanceRegistrarProfessionalInfo:
 *       type: object
 *       required:
 *         - qualification
 *         - workExperience
 *         - dateOfJoining
 *         - contractType
 *         - workShift
 *         - workLocation
 *       properties:
 *         qualification:
 *           type: string
 *           minLength: 2
 *           example: "MBA Finance"
 *           description: Educational qualification (minimum 2 characters)
 *         workExperience:
 *           type: number
 *           minimum: 0
 *           example: 5
 *           description: Years of work experience
 *         dateOfJoining:
 *           type: string
 *           format: date
 *           pattern: "^\\d{4}-\\d{2}-\\d{2}$"
 *           example: "2024-01-15"
 *           description: Joining date in YYYY-MM-DD format
 *         contractType:
 *           type: string
 *           enum: [Full-time, Part-time, Contract]
 *           example: "Full-time"
 *           description: Type of employment contract
 *         workShift:
 *           type: string
 *           enum: [Morning, Evening, Night]
 *           example: "Morning"
 *           description: Assigned work shift
 *         workLocation:
 *           type: string
 *           minLength: 2
 *           example: "Main Campus"
 *           description: Work location (minimum 2 characters)
 *     
 *     FinanceRegistrarAddressInfo:
 *       type: object
 *       required:
 *         - address
 *         - permanentAddress
 *       properties:
 *         address:
 *           type: string
 *           minLength: 5
 *           example: "123 Main St, City"
 *           description: Current address (minimum 5 characters)
 *         permanentAddress:
 *           type: string
 *           minLength: 5
 *           example: "123 Main St, City"
 *           description: Permanent address (minimum 5 characters)
 *     
 *     FinanceRegistrarEmploymentInfo:
 *       type: object
 *       required:
 *         - panNumber
 *         - epfNumber
 *         - basicSalary
 *         - medicalLeaves
 *         - casualLeaves
 *         - maternityLeaves
 *         - sickLeaves
 *       properties:
 *         panNumber:
 *           type: string
 *           pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
 *           example: "ABCDE1234F"
 *           description: PAN card number
 *         epfNumber:
 *           type: string
 *           minLength: 5
 *           example: "EP123456789"
 *           description: EPF number (minimum 5 characters)
 *         basicSalary:
 *           type: number
 *           minimum: 1
 *           example: 50000
 *           description: Basic salary amount
 *         medicalLeaves:
 *           type: number
 *           minimum: 0
 *           example: 12
 *           description: Number of medical leaves allowed
 *         casualLeaves:
 *           type: number
 *           minimum: 0
 *           example: 12
 *           description: Number of casual leaves allowed
 *         maternityLeaves:
 *           type: number
 *           minimum: 0
 *           example: 0
 *           description: Number of maternity leaves allowed
 *         sickLeaves:
 *           type: number
 *           minimum: 0
 *           example: 7
 *           description: Number of sick leaves allowed
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
 *           minLength: 2
 *           example: "John Doe"
 *           description: Bank account holder name (minimum 2 characters)
 *         accountNumber:
 *           type: string
 *           pattern: "^\\d{9,18}$"
 *           example: "1234567890"
 *           description: Bank account number (9-18 digits)
 *         bankName:
 *           type: string
 *           minLength: 2
 *           example: "State Bank"
 *           description: Name of the bank (minimum 2 characters)
 *         ifscCode:
 *           type: string
 *           pattern: "^[A-Z]{4}0[A-Z0-9]{6}$"
 *           example: "ABCD0123456"
 *           description: IFSC code of the bank branch
 *     
 *     FinanceRegistrarAuthentication:
 *       type: object
 *       required:
 *         - password
 *         - confirmPassword
 *       properties:
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           pattern: "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$"
 *           example: "StrongPass123!"
 *           description: Password (min 8 chars, must include uppercase, lowercase, number, special char)
 *         confirmPassword:
 *           type: string
 *           format: password
 *           example: "StrongPass123!"
 *           description: Must match the password field
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
 * /finance/register:
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
 *               - addressInfo
 *               - authentication
 *               - image
 *               - resume
 *               - joiningLetter
 *               - personalDocs
 *             properties:
 *               personalInfo:
 *                 $ref: '#/components/schemas/FinanceRegistrarPersonalInfo'
 *               professionalInfo:
 *                 $ref: '#/components/schemas/FinanceRegistrarProfessionalInfo'
 *               employmentInfo:
 *                 $ref: '#/components/schemas/FinanceRegistrarEmploymentInfo'
 *               bankInfo:
 *                 $ref: '#/components/schemas/FinanceRegistrarBankInfo'
 *               addressInfo:
 *                 $ref: '#/components/schemas/FinanceRegistrarAddressInfo'
 *               authentication:
 *                 $ref: '#/components/schemas/FinanceRegistrarAuthentication'
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