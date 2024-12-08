import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { db } from '../config/dbConfig';
import { usersTable, rolesTable } from '../db/tables';
import { eq } from 'drizzle-orm';
import { MulterFile } from '../types/multerFile';
import * as libraryModel from '../models/libraryModel';
import { libraryUserRegistrationSchema } from '../middleware/validationMiddleware';

const UPLOAD_DIR = path.resolve(__dirname, '../uploads');

const deleteUploadedFiles = (files: MulterFile[]) => {
    files.forEach(file => {
        const safeFilePath = path.join(UPLOAD_DIR, path.basename(file.path));
        
        if (!safeFilePath.startsWith(UPLOAD_DIR)) {
            console.error(`❌ Security Error: Invalid file path detected: ${file.path}`);
            return;
        }
        fs.unlink(safeFilePath, (err) => {
            if (err) {
                console.error(`❌ Error deleting file ${safeFilePath}:`, err);
            } else {
                console.log(`✅ File deleted successfully: ${safeFilePath}`);
            }
        });
    });
};

/**
 * Register a new library user
 * @route POST /library/register
 * @access Public
 */
export const registerLibraryUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const files = req.files as Record<string, MulterFile[]>;
    try {
        // Validate input using Zod
        const validatedData = libraryUserRegistrationSchema.parse({
            ...req.body,
            title: req.body.title || '', // Add title with default empty string
            status: req.body.status || 'active' // Add status with default 'active'
        });

        // Hash the password
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        // Find library user role
        const roleQuery = await db.select().from(rolesTable).where(eq(rolesTable.role_name, 'library_staff')).limit(1);
        if (roleQuery.length === 0) {
            if (files) deleteUploadedFiles(Object.values(files).flat());
            res.status(500).json({ 
                message: 'Library user role not found. Ensure the "rolesTable" has an entry for "library_staff".', 
                error: {
                    code: 'ROLE_NOT_FOUND',
                    details: 'No role matching library_staff was found in the roles table.'
                }
            });
            return;
        }
        const roleId = roleQuery[0].id;

        // Prepare user entry
        const newUser = {
            username: validatedData.username,
            password: hashedPassword,
            role_id: roleId,
            email: validatedData.email,
            first_name: validatedData.firstName,
            last_name: validatedData.lastName,
            image: files?.image?.[0]?.path || ''
        };

        // Transaction to create library user
        await db.transaction(async trx => {
            // Insert user in users table
            await trx.insert(usersTable).values(newUser).execute();
        });

        // Generate JWT token
        const libraryUserToken = jwt.sign(
            { 
                id: validatedData.username, 
                username: validatedData.username, 
                role: 'library_staff' 
            },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        // Respond with success
        res.status(201).json({ 
            message: 'Library User created successfully', 
            token: libraryUserToken, 
            user: newUser 
        });
    } catch (error: any) {
        // Handle errors and clean up files
        if (files) deleteUploadedFiles(Object.values(files).flat());
        
        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            res.status(400).json({
                message: 'Validation failed',
                error: {
                    code: 'VALIDATION_ERROR',
                    details: error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                }
            });
            return;
        }

        // Handle unique constraint violations (potential duplicate username/email)
        if (error.code === '23505') {  // PostgreSQL unique constraint violation
            res.status(409).json({
                message: 'User registration failed',
                error: {
                    code: 'CONFLICT',
                    details: 'Username or email already exists'
                }
            });
            return;
        }

        // Handle other errors
        res.status(500).json({ 
            message: 'Error creating Library User', 
            error: {
                code: 'SERVER_ERROR',
                details: error.message || 'An unexpected error occurred'
            }
        });
    }
};

/**
 * Login a library user
 * @route POST /library/login
 * @access Public
 */
export const loginLibraryUser = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    try {
        // Validate input
        const { username, password } = req.body;

        // Attempt to login
        const loginResult = await libraryModel.loginLibraryManager(username, password);

        // Handle login result
        if (!loginResult) {
            return res.status(401).json({
                message: 'Login failed',
                error: {
                    code: 'UNAUTHORIZED',
                    details: 'Invalid username or password'
                }
            });
        }

        // Respond with token and user details
        res.status(200).json({
            message: 'Login successful',
            token: loginResult.token,
            user: {
                id: loginResult.user.id,
                username: loginResult.user.username,
                email: loginResult.user.email,
                firstName: loginResult.user.firstName,
                lastName: loginResult.user.lastName,
                role: 'library_staff',
                lastLogin: new Date().toISOString()
            }
        });
    } catch (error: any) {
        console.error('❌ Library User Login Error:', error);
        
        // Handle specific error types
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Authentication failed',
                error: {
                    code: 'TOKEN_ERROR',
                    details: 'Invalid authentication token'
                }
            });
        }

        // Generic server error
        res.status(500).json({
            message: 'Login process failed', 
            error: {
                code: 'SERVER_ERROR',
                details: error.message || 'An unexpected error occurred during login'
            }
        });
    }
};

/**
 * Get library user profile
 * @route GET /library/profile
 * @access Private
 */
export const getLibraryUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username } = req.params;

        // Fetch user profile
        const profile = await libraryModel.getLibraryUserProfile(username);

        if (!profile) {
            res.status(404).json({ message: 'Library user not found' });
            return;
        }

        res.status(200).json({ user: profile });
    } catch (error) {
        console.error(`❌ Error retrieving library user profile:`, error);
        res.status(500).json({ 
            message: 'Failed to retrieve library user profile', 
            error: error instanceof Error ? error.message : error 
        });
    }
};
