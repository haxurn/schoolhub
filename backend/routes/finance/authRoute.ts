// backend/routes/finance/authRoute.ts

import express from 'express';
import { loginFinanceRegistrar } from '../../controllers/authController'; 

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Finance Staff Management
 *   description: Finance staff authentication and registration endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FinanceLoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Finance staff username
 *           example: finance_user
 *         password:
 *           type: string
 *           format: password
 *           description: Finance staff password
 *           example: "********"
 *     
 *     FinanceLoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Login successful
 *         token:
 *           type: string
 *           description: JWT authentication token
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: fin_123
 *             name:
 *               type: string
 *               example: John Doe
 *             role:
 *               type: string
 *               example: finance
 *             email:
 *               type: string
 *               example: john.doe@school.com
 *     
 *     FinanceRegistration:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - emailAddress
 *         - primaryContactNumber
 *         - dateOfJoining
 *         - password
 *       properties:
 *         personalInfo:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *               example: John
 *             lastName:
 *               type: string
 *               example: Doe
 *             emailAddress:
 *               type: string
 *               format: email
 *               example: john.doe@school.com
 *             primaryContactNumber:
 *               type: string
 *               example: "+1234567890"
 *             dateOfBirth:
 *               type: string
 *               format: date
 *               example: "1990-01-01"
 *             gender:
 *               type: string
 *               enum: [Male, Female, Other]
 *             bloodGroup:
 *               type: string
 *               example: "O+"
 *             maritalStatus:
 *               type: string
 *               enum: [Single, Married, Divorced, Widowed]
 *         professionalInfo:
 *           type: object
 *           properties:
 *             qualification:
 *               type: string
 *               example: "MBA Finance"
 *             workExperience:
 *               type: integer
 *               example: 5
 *             dateOfJoining:
 *               type: string
 *               format: date
 *               example: "2023-01-01"
 *             contractType:
 *               type: string
 *               enum: [Full-time, Part-time, Contract]
 *             basicSalary:
 *               type: integer
 *               example: 50000
 *         documents:
 *           type: object
 *           properties:
 *             image:
 *               type: string
 *               format: binary
 *             resume:
 *               type: string
 *               format: binary
 *             joiningLetter:
 *               type: string
 *               format: binary
 *             personalDocs:
 *               type: string
 *               format: binary
 */

/**
 * @swagger
 * /finance/login:
 *   post:
 *     summary: Authenticate finance staff
 *     tags: [Finance Staff Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FinanceLoginRequest'
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FinanceLoginResponse'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Authentication failed
 *       429:
 *         description: Too many login attempts
 *       500:
 *         description: Server error
 */
router.post('/login', loginFinanceRegistrar);

export default router;