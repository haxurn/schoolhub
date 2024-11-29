// backend/routes/authRoutes.ts

import express from 'express';
import { loginAdmin } from '../controllers/authController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: documentation for authentication
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




router.post('/admin', loginAdmin);

export default router;
