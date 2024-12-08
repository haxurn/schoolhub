import express from 'express';
import { loginLibraryUser } from '../../controllers/authController';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     LibraryUserLogin:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           format: username
 *           example: john_doe
 *           description: Registered username  of the library user
 *         password:
 *           type: string
 *           format: password
 *           example: SecurePass123!
 *           description: User's account password
 * 
 *     LibraryUserLoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Login successful
 *         token:
 *           type: string
 *           description: JWT authentication token
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *             username:
 *               type: string
 *             role:
 *               type: string
 *               enum: [student, staff, admin]
 * 
 *     LibraryUserError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Descriptive error message
 *           example: Invalid credentials
 * 
 * /library/login:
 *   post:
 *     summary: Authenticate a library user
 *     description: Endpoint for library user authentication with username and password
 *     tags: 
 *       - Library
 *     requestBody:
 *       description: User login credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LibraryUserLogin'
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LibraryUserLoginResponse'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LibraryUserError'
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LibraryUserError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LibraryUserError'
 */
router.post('/login', loginLibraryUser);

export default router;