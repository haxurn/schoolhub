// backend/routes/admin/authRoute.ts

import express from 'express';
import { loginAdmin } from '../../controllers/authController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: 
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminLoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Admin's username
 *           example: admin123
 *         password:
 *           type: string
 *           format: password
 *           description: Admin's secure password
 *           example: "********"
 *     AdminLoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
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
 *               description: Admin's unique identifier
 *               example: admin_123
 *             username:
 *               type: string
 *               description: Admin's username
 *               example: admin123
 *             role:
 *               type: string
 *               description: User's role
 *               example: admin
 *             permissions:
 *               type: array
 *               items:
 *                 type: string
 *               description: List of admin permissions
 *               example: ["manage_users", "manage_students", "manage_staff"]
 */

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Authenticate admin user
 *     tags: [Admin]
 *     description: |
 *       Authenticates an admin user and returns a JWT token.
 *       This endpoint validates admin credentials and provides access to admin-specific functionalities.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminLoginRequest'
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminLoginResponse'
 *       400:
 *         description: Bad request - Invalid input parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Username and password are required
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid username or password
 *       429:
 *         description: Too many login attempts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Too many login attempts. Please try again later
 *                 retryAfter:
 *                   type: number
 *                   example: 300
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error occurred
 */

router.post('/login', loginAdmin);

export default router;