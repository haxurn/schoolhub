import { Request, Response } from 'express';
import { getAdminByUsername, comparePassword as adminComparePassword } from '../models/adminModel';
import { getFinanceRegistrarByUsername } from '../models/financeRegistrarModel';
import { getParentByEmail, getParentWithChildren } from '../models/parentModel';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { rateLimit } from 'express-rate-limit';
import { createLogger } from '../utils/logger';
import bcrypt from 'bcrypt';

const logger = createLogger('authController');

// Validation schemas
const loginSchema = z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(6).max(100)
});

const parentLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100)
});

interface TokenPayload {
    id: string;
    username: string;
    role: 'admin' | 'finance' | 'parent';
    iat?: number;
    exp?: number;
}

// Constants
const JWT_EXPIRY: string = '1h';
const MAX_LOGIN_ATTEMPTS: number = 5;
const LOGIN_WINDOW: number = 15 * 60 * 1000; // 15 minutes

// Rate limiting for login attempts
export const loginRateLimiter = rateLimit({
    windowMs: LOGIN_WINDOW,
    max: MAX_LOGIN_ATTEMPTS,
    message: { 
        message: 'Too many login attempts. Please try again later.',
        remainingTime: 'Please wait for 15 minutes'
    }
});

/**
 * Generate JWT token for authenticated users
 */
const generateToken = (payload: TokenPayload): string => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }
    
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
    );
};

/**
 * Handle authentication errors with appropriate responses
 */
const handleAuthError = (res: Response, error: unknown): void => {
    logger.error('Authentication error:', error);
    
    if (error instanceof z.ZodError) {
        res.status(400).json({
            message: 'Invalid input data',
            errors: error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }))
        });
        return;
    }

    if (error instanceof Error) {
        if (error.message === 'JWT_SECRET is not configured') {
            res.status(500).json({
                message: 'Server configuration error',
                error: 'Authentication service unavailable'
            });
            return;
        }
    }

    res.status(500).json({
        message: 'Internal server error',
        error: 'An unexpected error occurred during authentication'
    });
};

/**
 * Admin login handler
 */
export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate input
        const validatedData = loginSchema.parse(req.body);
        const { username, password } = validatedData;

        // Get admin user
        const admin = await getAdminByUsername(username);
        if (!admin) {
            logger.warn(`Failed login attempt for admin username: ${username}`);
            res.status(401).json({
                message: 'Invalid credentials',
                error: 'Username or password is incorrect'
            });
            return;
        }

        // Verify password
        const isPasswordValid = await adminComparePassword(password, admin.password);
        if (!isPasswordValid) {
            logger.warn(`Invalid password attempt for admin: ${username}`);
            res.status(401).json({
                message: 'Invalid credentials',
                error: 'Username or password is incorrect'
            });
            return;
        }

        // Generate token
        const token = generateToken({
            id: admin.id.toString(), // Convert number to string
            username: admin.username,
            role: 'admin'
        });

        logger.info(`Successful admin login: ${username}`);
        
        // Send response with token and user info
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: admin.id.toString(), // Convert number to string
                username: admin.username,
                role: 'admin',
                lastLogin: new Date().toISOString()
            }
        });
        
    } catch (error) {
        handleAuthError(res, error);
    }
};

/**
 * Finance registrar login handler
 */
export const loginFinanceRegistrar = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate input
        const validatedData = loginSchema.parse(req.body);
        const { username, password } = validatedData;

        // Get registrar
        const registrar = await getFinanceRegistrarByUsername(username);
        if (!registrar) {
            logger.warn(`Failed login attempt for finance username: ${username}`);
            res.status(401).json({
                message: 'Invalid credentials',
                error: 'Username or password is incorrect'
            });
            return;
        }

        // Verify password
        const isPasswordValid = await adminComparePassword(password, registrar.password);
        if (!isPasswordValid) {
            logger.warn(`Invalid password attempt for finance: ${username}`);
            res.status(401).json({
                message: 'Invalid credentials',
                error: 'Username or password is incorrect'
            });
            return;
        }

        // Generate token
        const token = generateToken({
            id: registrar.id.toString(), // Convert number to string
            username: registrar.username,
            role: 'finance'
        });

        logger.info(`Successful finance login: ${username}`);

        // Send response with token and user info
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: registrar.id.toString(), // Convert number to string
                username: registrar.username,
                role: 'finance',
                lastLogin: new Date().toISOString()
            }
        });

    } catch (error) {
        handleAuthError(res, error);
    }
};

/**
 * Parent login handler
 */
export const loginParent = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate input
        const validatedData = parentLoginSchema.parse(req.body);
        const { email, password } = validatedData;

        // Get parent user
        const parent = await getParentByEmail(email);
        if (!parent) {
            logger.warn(`Failed login attempt for parent email: ${email}`);
            res.status(401).json({
                message: 'Invalid credentials',
                error: 'Email or password is incorrect'
            });
            return;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, parent.password);
        if (!isPasswordValid) {
            logger.warn(`Invalid password attempt for parent: ${email}`);
            res.status(401).json({
                message: 'Invalid credentials',
                error: 'Email or password is incorrect'
            });
            return;
        }

        // Get parent with children information
        const parentWithChildren = await getParentWithChildren(parent.id);
        if (!parentWithChildren) {
            logger.error(`Failed to get children info for parent ID: ${parent.id}`);
            res.status(500).json({
                message: 'Internal server error',
                error: 'Failed to get children information'
            });
            return;
        }

        // Generate token
        const token = generateToken({
            id: parent.id.toString(),
            username: parent.fatherEmail, // Use father's email as username
            role: 'parent'
        });

        logger.info(`Successful parent login: ${email}`);
        
        // Send response with token and user info
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: parent.id.toString(),
                fatherName: parent.fatherName,
                fatherEmail: parent.fatherEmail,
                motherName: parent.motherName,
                motherEmail: parent.motherEmail,
                role: 'parent',
                children: parentWithChildren.children.map(child => ({
                    id: child.id.toString(),
                    name: `${child.firstName} ${child.lastName}`,
                    class: child.class,
                    section: child.section,
                    admissionNumber: child.admissionNumber
                })),
                lastLogin: new Date().toISOString()
            }
        });
        
    } catch (error) {
        handleAuthError(res, error);
    }
};