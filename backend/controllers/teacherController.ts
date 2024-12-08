// backend/controllers/teacherController.ts
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as TeacherModel from '../models/teacherModel';
import { 
    teacherRegistrationSchema, 
} from '../validators/teacherValidators';
import { MulterFile } from '../types/multerFile';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';

const UPLOAD_DIR = path.resolve(__dirname, '../uploads');

const deleteUploadedFiles = (files: MulterFile[]) => {
    if (!files || files.length === 0) return;

    files.forEach((file) => {
        // Sanitize file path to prevent path traversal
        const sanitizedFileName = path.basename(file.path);
        const safeFilePath = path.join(UPLOAD_DIR, sanitizedFileName);

        // Double-check file path security
        if (!safeFilePath.startsWith(UPLOAD_DIR)) {
            console.error('❌ Security Error: Invalid file path detected');
            return;
        }

        // Use safe path deletion with error handling
        fs.unlink(safeFilePath, (err) => {
            if (err) {
                console.error(`❌ Error deleting file: ${sanitizedFileName}`, err);
            } else {
                console.log(`✅ File deleted successfully: ${sanitizedFileName}`);
            }
        });
    });
};

// Teacher Registration Controller
export const registerTeacher = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const files = req.files as Record<string, MulterFile[]>;
    try {
        // Log incoming request body for debugging
        console.log('Incoming request body:', req.body);

        // Validate input data
        const { firstName, lastName, email } = req.body;
        if (!firstName || !lastName || !email) {
            res.status(400).json({
                message: 'Error creating Teacher',
                error: {
                    code: 'VALIDATION_ERROR',
                    details: 'first_name, last_name and email are required'
                }
            });
            return;
        }

        // Validate input using Zod
        const rawData = {
            ...req.body,
            image: files?.image?.[0]?.path || '',
            dateOfBirth: req.body.dateOfBirth || new Date('1990-01-01'),
            gender: req.body.gender || 'Other',
            bloodGroup: req.body.bloodGroup || 'O+',
            address: req.body.address || 'Not Provided',
            maritalStatus: req.body.maritalStatus || 'Single',
            dateOfJoining: new Date(req.body.dateOfJoining || new Date()), // Ensure this is a Date object
            workExperience: Number(req.body.workExperience), // Ensure this is a number
            workShift: req.body.workShift || 'Morning',
            workLocation: req.body.workLocation || 'Main Campus',
            salary: Number(req.body.salary) || 0, // Ensure this is a number
            subject: req.body.subject || 'General',
        };

        // Validate and sanitize data
        const validatedData = teacherRegistrationSchema.parse(rawData);

        const newUser = validatedData;

        // Log the newUser object before creating the teacher
        console.log('New User Object:', newUser);

        const teacherResult = await TeacherModel.createTeacher(newUser);

        // Debugging log
        console.log('Teacher Result:', teacherResult);

        // Check if user exists
        if (!teacherResult.user) {
            res.status(500).json({
                message: 'Error creating Teacher',
                error: {
                    code: 'SERVER_ERROR',
                    details: 'User object is undefined in teacherResult'
                }
            });
            return;
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: teacherResult.user.id,
                username: teacherResult.user.username,
                role: 'teacher'
            }, 
            process.env.JWT_SECRET as string, 
            { 
                expiresIn: '24h' 
            }
        );

        // Respond with success
        res.status(201).json({ 
            message: 'Teacher created successfully', 
            token: token, 
            user: teacherResult.user 
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

        // Handle unique constraint violations
        if (error.code === '23505') {
            res.status(409).json({
                message: 'Teacher registration failed',
                error: {
                    code: 'CONFLICT',
                    details: 'Username or email already exists'
                }
            });
            return;
        }

        // Handle other errors
        res.status(500).json({ 
            message: 'Error creating Teacher', 
            error: {
                code: 'SERVER_ERROR',
                details: error.message || 'An unexpected error occurred'
            },
            stack: error.stack
        });
    }
};

// Login Teacher Controller
export const loginTeacher = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // Attempt login
        const loginResult = await TeacherModel.loginTeacher(username, password);

        // Destructure login result
        const { token, teacher } = loginResult;

        // Fetch full teacher profile
        const teacherProfile = await TeacherModel.getTeacherProfile(username);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: teacher.id,
                username: teacher.username,
                firstName: teacherProfile.firstName,
                lastName: teacherProfile.lastName,
                email: teacherProfile.email,
                image: teacherProfile.image
            }
        });
    } catch (error) {
        console.error('❌ Teacher Login Error:', error);
        res.status(401).json({
            message: error instanceof Error ? error.message : 'Login failed'
        });
    }
};

// Get Teacher Profile Controller
export const getTeacherProfile = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;
        const teacherProfile = await TeacherModel.getTeacherProfile(username);
        
        res.status(200).json({
            message: 'Teacher profile retrieved successfully',
            data: teacherProfile
        });
    } catch (error) {
        console.error('❌ Get teacher profile error:', error);
        res.status(404).json({
            message: error instanceof Error ? error.message : 'Failed to retrieve teacher profile'
        });
    }
};

// Get Teacher by ID Controller
export const getTeacherById = async (req: Request, res: Response) => {
    try {
        const teacherId = req.params.id; // Assuming the ID comes from the request parameters
        console.log('Received Teacher ID:', teacherId);

        // Validate that teacherId is a valid integer
        const numericTeacherId = parseInt(teacherId, 10);
        if (isNaN(numericTeacherId)) {
            return res.status(400).json({
                message: 'Invalid Teacher ID'
            });
        }

        const teacher = await TeacherModel.getTeacherById(numericTeacherId);
        
        if (!teacher) {
            return res.status(404).json({
                message: 'Teacher not found'
            });
        }

        res.status(200).json({
            message: 'Teacher retrieved successfully',
            data: teacher
        });
    } catch (error) {
        console.error('❌ Get teacher by ID error:', error);
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Failed to retrieve teacher'
        });
    }
};

// Update Teacher Profile Controller
export const updateTeacherProfile = async (req: Request, res: Response) => {
    try {
        const { teacherId } = req.params;
        const updateData = req.body;

        const updatedTeacher = await TeacherModel.updateTeacherProfile(teacherId, updateData);
        
        if (!updatedTeacher) {
            return res.status(404).json({
                message: 'Teacher not found or update failed'
            });
        }

        res.status(200).json({
            message: 'Teacher profile updated successfully',
            data: updatedTeacher
        });
    } catch (error) {
        console.error('❌ Update teacher profile error:', error);
        res.status(400).json({
            message: error instanceof Error ? error.message : 'Failed to update teacher profile'
        });
    }
};

// Delete Teacher Controller
export const deleteTeacher = async (req: Request, res: Response) => {
    try {
        const { teacherId } = req.params;

        await TeacherModel.deleteTeacher(teacherId);

        res.status(200).json({
            message: 'Teacher soft deleted successfully'
        });
    } catch (error) {
        console.error('❌ Delete teacher error:', error);
        res.status(400).json({
            message: error instanceof Error ? error.message : 'Failed to delete teacher'
        });
    }
};

// Get Current Teacher Profile Controller
export const getCurrentTeacherProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Extract email from authenticated request
        const email = req.user?.email;

        if (!email) {
            res.status(401).json({
                message: 'Authentication Failed',
                error: {
                    code: 'UNAUTHORIZED',
                    details: 'No authenticated user found'
                }
            });
            return;
        }

        // Fetch teacher profile
        const profile = await TeacherModel.getTeacherProfileByEmail(email);

        if (!profile) {
           res.status(404).json({ 
                message: 'Teacher profile not found',
                error: {
                    code: 'NOT_FOUND',
                    details: 'Unable to retrieve teacher profile'
                }
            });
            return;
        }

        // Respond with teacher profile
        res.status(200).json({
            message: 'Teacher profile retrieved successfully',
            user: profile
        });

    } catch (error) {
        console.error('❌ Get current teacher profile error:', error);
        next(error);
    }
};

// Request Password Reset Controller
export const requestPasswordReset = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        // Generate password reset token
        const resetToken = await TeacherModel.generatePasswordResetToken(email);

        // TODO: Send email with reset instructions
        res.status(200).json({
            message: 'Password reset token generated successfully',
            resetToken // Only for testing, remove in production
        });
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : 'An error occurred',
        });
    }
};

// Confirm Password Reset Controller
export const confirmPasswordReset = async (req: Request, res: Response) => {
    try {
        const { token, newPassword } = req.body;

        // Reset password
        const result = await TeacherModel.resetPassword(token, newPassword);

        res.status(200).json(result);
    } catch (error) {
        console.error('❌ Password reset confirmation error:', error);
        res.status(400).json({
            message: error instanceof Error ? error.message : 'An error occurred'
        });
    }
};

// List Teachers Controller
export const listTeachers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract pagination and filter parameters
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const filters = req.query;

        // Fetch paginated list of teachers
        const { teachers } = await TeacherModel.listTeachers(page, limit, filters);

        res.status(200).json({
            message: 'Teachers retrieved successfully',
            data: {
                teachers
            }
        });
    } catch (error: any) {
        console.error('❌ List Teachers Error:', error);
        res.status(500).json({
            message: 'Failed to retrieve teachers', 
            error: {
                code: 'SERVER_ERROR',
                details: error.message || 'An unexpected error occurred'
            }
        });
    }
};

// Generate Password Reset Token Controller
export const requestPasswordResetController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        // Validate email input
        const emailSchema = z.string().email('Invalid email format');
        const validatedEmail = emailSchema.parse(email);

        // Generate password reset token
        const resetTokenResult = await TeacherModel.generatePasswordResetToken(validatedEmail);

        // TODO: Implement email sending service to send reset token
        res.status(200).json({
            message: 'Password reset token generated successfully',
            resetToken: resetTokenResult // Only for testing, remove in production
        });
    } catch (error) {
        next(error);
    }
};

// Reset Password Controller
export const resetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { resetToken, newPassword } = req.body;

        // Validate input
        const resetSchema = z.object({
            resetToken: z.string().min(1, 'Reset token is required'),
            newPassword: z.string().min(8, 'Password must be at least 8 characters long')
        });
        const validatedData = resetSchema.parse({ resetToken, newPassword });

        // Reset password
        const result = await TeacherModel.resetPassword(validatedData.resetToken, validatedData.newPassword);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
