// backend/routes/authRoutes.ts

import express from 'express';
import { loginAdmin } from '../controllers/authController';
import { registerFinanceRegistrar } from '../controllers/registerController';
import { upload } from '../middleware/fileUploadMiddleware'; 
import { verifyAdminToken } from '../middleware/authMiddleware'; 
import { validateFinanceRegistrarData } from '../middleware/validationMiddleware';
import { loginFinanceRegistrar } from '../controllers/authController'; 

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Documentation for authentication
 */

/**
 * @swagger
 * /auth/admin:
 *   post:
 *     summary: Login as an admin
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: The admin username
 *               password:
 *                 type: string
 *                 description: The admin password
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       401:
 *         description: Invalid username or password
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/finance:
 *   post:
 *     summary: Login as a finance 
 *     tags: [Finance Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: The registrar's username
 *               password:
 *                 type: string
 *                 description: The registrar's password
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       401:
 *         description: Invalid username or password
 *       404:
 *         description: Registrar not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/register-finance:
 *   post:
 *     summary: Register a new Finance Re
 *     tags: [Registration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name of the registrar
 *               lastName:
 *                 type: string
 *                 description: Last name of the registrar
 *               primaryContactNumber:
 *                 type: string
 *                 description: Primary contact number
 *               emailAddress:
 *                 type: string
 *                 description: Email address
 *               bloodGroup:
 *                 type: string
 *                 description: Blood group
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Profile image
 *               dateOfJoining:
 *                 type: string
 *                 format: date
 *                 description: Date of joining
 *               gender:
 *                 type: string
 *                 description: Gender
 *               fathersName:
 *                 type: string
 *                 description: Father's name
 *               mothersName:
 *                 type: string
 *                 description: Mother's name
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: Date of birth
 *               maritalStatus:
 *                 type: string
 *                 description: Marital status
 *               languagesKnown:
 *                 type: string
 *                 description: Languages known
 *               qualification:
 *                 type: string
 *                 description: Qualification
 *               workExperience:
 *                 type: integer
 *                 description: Work experience in years
 *               previousWork:
 *                 type: string
 *                 description: Previous work
 *               previousWorkAddress:
 *                 type: string
 *                 description: Previous work address
 *               previousWorkPhoneNumber:
 *                 type: string
 *                 description: Previous work phone number
 *               address:
 *                 type: string
 *                 description: Current address
 *               permanentAddress:
 *                 type: string
 *                 description: Permanent address
 *               panNumber:
 *                 type: string
 *                 description: PAN number / ID number
 *               epfNumber:
 *                 type: string
 *                 description: EPF number
 *               basicSalary:
 *                 type: integer
 *                 description: Basic salary
 *               contractType:
 *                 type: string
 *                 description: Contract type
 *               workShift:
 *                 type: string
 *                 description: Work shift
 *               workLocation:
 *                 type: string
 *                 description: Work location
 *               dateOfLeaving:
 *                 type: string
 *                 format: date
 *                 description: Date of leaving
 *               medicalLeaves:
 *                 type: integer
 *                 description: Number of medical leaves
 *               casualLeaves:
 *                 type: integer
 *                 description: Number of casual leaves
 *               maternityLeaves:
 *                 type: integer
 *                 description: Number of maternity leaves
 *               sickLeaves:
 *                 type: integer
 *                 description: Number of sick leaves
 *               accountName:
 *                 type: string
 *                 description: Bank account name
 *               accountNumber:
 *                 type: string
 *                 description: Bank account number
 *               bankName:
 *                 type: string
 *                 description: Bank name
 *               ifscCode:
 *                 type: string
 *                 description: IFSC code
 *               facebook:
 *                 type: string
 *                 description: Facebook profile link
 *               instagram:
 *                 type: string
 *                 description: Instagram profile link
 *               linkedin:
 *                 type: string
 *                 description: LinkedIn profile link
 *               youtube:
 *                 type: string
 *                 description: YouTube channel link
 *               twitterUrl:
 *                 type: string
 *                 description: Twitter profile link
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: Resume document
 *               joiningLetter:
 *                 type: string
 *                 format: binary
 *                 description: Joining letter document
 *               personalDocs:
 *                 type: string
 *                 format: binary
 *                 description: Personal documents
 *               password:
 *                 type: string
 *                 description: Password
 *     responses:
 *       201:
 *         description: Finance  created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.post('/admin', loginAdmin);

router.post('/register-finance',verifyAdminToken, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: 'joiningLetter', maxCount: 1 },
    { name: 'personalDocs', maxCount: 1 }
]), registerFinanceRegistrar);



router.post('/finance', loginFinanceRegistrar);

export default router;
