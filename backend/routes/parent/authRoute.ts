// backend/routes/parent/authRoute.ts

import express from 'express';
import { loginParent } from '../../controllers/authController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Parent
 *   description: 
 * 
 * components:
 *   schemas:
 *     ParentLoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Parent's username (usually email)
 *           example: "parent.user@example.com"
 *         password:
 *           type: string
 *           format: password
 *           description: Parent's password
 *           example: "********"
 *     
 *     ParentLoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Login successful"
 *         token:
 *           type: string
 *           description: JWT authentication token
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "PAR2024001"
 *             username:
 *               type: string
 *               example: "parent.user@example.com"
 *             role:
 *               type: string
 *               example: "parent"
 *             children:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "STU2024001"
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   class:
 *                     type: string
 *                     example: "10"
 *                   section:
 *                     type: string
 *                     example: "A"
 */

/**
 * @swagger
 * /parent/login:
 *   post:
 *     summary: Authenticate parent
 *     tags: [Parent]
 *     description: |
 *       Login endpoint for parents using their email and password.
 *       A successful login returns a JWT token and parent details including children information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ParentLoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ParentLoginResponse'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Authentication failed
 *       429:
 *         description: Too many login attempts
 *       500:
 *         description: Server error
 */
router.post('/login', loginParent);

export default router;
