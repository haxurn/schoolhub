// backend/routes/student/authRoutes.ts

import express from 'express';
import { loginStudent } from '../../controllers/studentAuthController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Student
 *   description: 
 * 
 * components:
 *   schemas:
 *     StudentLoginRequest:
 *       type: object
 *       required:
 *         - admissionNumber
 *         - password
 *       properties:
 *         admissionNumber:
 *           type: string
 *           description: Student's admission number
 *           example: "STU2024001"
 *         password:
 *           type: string
 *           format: password
 *           description: Student's password
 *           example: "********"
 *     
 *     StudentLoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Login successful"
 *         token:
 *           type: string
 *           description: JWT authentication token
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         student:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "STU2024001"
 *             name:
 *               type: string
 *               example: "John Doe"
 *             email:
 *               type: string
 *               example: "john.doe@school.com"
 *             class:
 *               type: string
 *               example: "10A"
 *             role:
 *               type: string
 *               example: "student"
 */

/**
 * @swagger
 * /student/login:
 *   post:
 *     summary: Authenticate student
 *     tags: [Student]
 *     description: |
 *       Login endpoint for students using their admission number and password.
 *       A successful login returns a JWT token and student details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentLoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentLoginResponse'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       429:
 *         description: Too many login attempts
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
router.post('/login', loginStudent);

export default router;