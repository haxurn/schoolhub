// backend/routes/library/registerRoute.ts
import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { registerLibraryUser } from '../../controllers/libraryController';
import { upload } from '../../middleware/uploadMiddleware';
import { validateLibraryUserRegistration } from '../../middleware/validationMiddleware';
import { adminOnly } from '../../middleware/authMiddleware';

/**
 * Express router for library routes
 * @module LibraryRoutes
 * @description Handles routes related to library management and registration
 */
const router = express.Router();

/**
 * @swagger
 * /library/register:
 *   post:
 *     tags:
 *       - Library
 *     summary: Register a new library manager
 *     description: |
 *       Register a new library manager with comprehensive profile details. 
 *       Supports optional profile image upload.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Unique username for the library manager
 *                 example: john_doe_library
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Unique email address for the library manager
 *                 example: john.doe@schoolhub.edu
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password for the library manager account
 *                 minLength: 8
 *               firstName:
 *                 type: string
 *                 description: First name of the library manager
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: Last name of the library manager
 *                 example: Doe
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional profile image for the library manager
 *             required:
 *               - username
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *     responses:
 *       201:
 *         description: Successfully registered library manager
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   description: Unique identifier for the library manager
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 image:
 *                   type: string
 *                   nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No token provided, authorization denied
 *       409:
 *         description: Conflict - email already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */


const registerHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await registerLibraryUser(req, res, next);
    } catch (error) {
        next(error);
    }
};

router.post(
    '/register', 
    adminOnly,
    upload.single('image'),  
    validateLibraryUserRegistration,
    registerHandler
);

export default router;