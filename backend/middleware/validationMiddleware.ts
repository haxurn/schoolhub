// backend/middleware/validationMiddleware.ts

import { Request, Response, NextFunction, RequestHandler } from 'express';
import { z } from 'zod';

// Define validation schema using Zod
const financeRegistrarSchema = z.object({
    personalInfo: z.object({
        firstName: z.string().min(2, 'First name must be at least 2 characters'),
        lastName: z.string().min(2, 'Last name must be at least 2 characters'),
        primaryContactNumber: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number format'),
        emailAddress: z.string().email('Invalid email address'),
        dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
        fathersName: z.string().min(2, 'Father\'s name must be at least 2 characters'),
        mothersName: z.string().min(2, 'Mother\'s name must be at least 2 characters'),
        bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
            errorMap: () => ({ message: 'Invalid blood group' })
        }),
        maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed'], {
            errorMap: () => ({ message: 'Invalid marital status' })
        })
    }),

    professionalInfo: z.object({
        qualification: z.string().min(2, 'Qualification must be at least 2 characters'),
        workExperience: z.number().min(0, 'Work experience cannot be negative'),
        dateOfJoining: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
        contractType: z.enum(['Full-time', 'Part-time', 'Contract'], {
            errorMap: () => ({ message: 'Invalid contract type' })
        }),
        workShift: z.enum(['Morning', 'Evening', 'Night'], {
            errorMap: () => ({ message: 'Invalid work shift' })
        }),
        workLocation: z.string().min(2, 'Work location must be at least 2 characters')
    }),

    addressInfo: z.object({
        address: z.string().min(5, 'Address must be at least 5 characters'),
        permanentAddress: z.string().min(5, 'Permanent address must be at least 5 characters')
    }),

    employmentInfo: z.object({
        panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number format'),
        epfNumber: z.string().min(5, 'Invalid EPF number'),
        basicSalary: z.number().positive('Salary must be positive'),
        medicalLeaves: z.number().min(0, 'Medical leaves cannot be negative'),
        casualLeaves: z.number().min(0, 'Casual leaves cannot be negative'),
        maternityLeaves: z.number().min(0, 'Maternity leaves cannot be negative'),
        sickLeaves: z.number().min(0, 'Sick leaves cannot be negative')
    }),

    bankInfo: z.object({
        accountName: z.string().min(2, 'Account name must be at least 2 characters'),
        accountNumber: z.string().regex(/^\d{9,18}$/, 'Invalid account number'),
        bankName: z.string().min(2, 'Bank name must be at least 2 characters'),
        ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code')
    }),

    authentication: z.object({
        password: z.string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number')
            .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"]
    })
});

type FinanceRegistrarData = z.infer<typeof financeRegistrarSchema>;

export const validateFinanceRegistrarData: RequestHandler = (req, res, next) => {
    try {
        // Parse the JSON strings from form data
        const personalInfo = typeof req.body.personalInfo === 'string' ? JSON.parse(req.body.personalInfo) : req.body.personalInfo;
        const professionalInfo = typeof req.body.professionalInfo === 'string' ? JSON.parse(req.body.professionalInfo) : req.body.professionalInfo;
        const addressInfo = typeof req.body.addressInfo === 'string' ? JSON.parse(req.body.addressInfo) : req.body.addressInfo;
        const employmentInfo = typeof req.body.employmentInfo === 'string' ? JSON.parse(req.body.employmentInfo) : req.body.employmentInfo;
        const bankInfo = typeof req.body.bankInfo === 'string' ? JSON.parse(req.body.bankInfo) : req.body.bankInfo;
        const authentication = typeof req.body.authentication === 'string' ? JSON.parse(req.body.authentication) : req.body.authentication;

        // Convert string numbers to actual numbers
        if (professionalInfo) {
            professionalInfo.workExperience = Number(professionalInfo.workExperience);
        }
        if (employmentInfo) {
            employmentInfo.basicSalary = Number(employmentInfo.basicSalary);
            employmentInfo.medicalLeaves = Number(employmentInfo.medicalLeaves);
            employmentInfo.casualLeaves = Number(employmentInfo.casualLeaves);
            employmentInfo.maternityLeaves = Number(employmentInfo.maternityLeaves);
            employmentInfo.sickLeaves = Number(employmentInfo.sickLeaves);
        }

        const data = {
            personalInfo,
            professionalInfo,
            addressInfo,
            employmentInfo,
            bankInfo,
            authentication
        };

        // Validate the structured data
        financeRegistrarSchema.parse(data);

        // Store the parsed data back in req.body
        req.body = {
            ...req.body,
            ...personalInfo,
            ...professionalInfo,
            ...addressInfo,
            ...employmentInfo,
            ...bankInfo,
            password: authentication?.password,
            confirmPassword: authentication?.confirmPassword
        };

        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));
            res.status(400).json({ message: 'Validation failed', errors });
        } else {
            res.status(400).json({ 
                message: 'Invalid request data', 
                error: error instanceof Error ? error.message : 'Unknown error' 
            });
        }
    }
};

// Student Registration Schema
const studentRegistrationSchema = z.object({
    // Personal Information
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    gender: z.enum(['Male', 'Female', 'Other'], { 
        errorMap: () => ({ message: 'Invalid gender' }) 
    }),
    bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
        errorMap: () => ({ message: 'Invalid blood group' })
    }),
    religionStatus: z.enum(['Christian', 'Muslim', 'Other'], {
        errorMap: () => ({ message: 'Invalid religion status' })
    }),
    emailAddress: z.string().email('Invalid email address'),
    motherTongue: z.string().min(2, 'Mother tongue must be at least 2 characters'),
    languagesKnown: z.string().min(1, 'Languages known must be specified'),
    class: z.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], {
        errorMap: () => ({ message: 'Invalid class' })
    }),
    section: z.enum(['A', 'B', 'C', 'D', 'E'], {
        errorMap: () => ({ message: 'Invalid section' })
    }),
    admissionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    rollNumber: z.string().min(1, 'Roll number is required'),

    // Parent Information
    fatherName: z.string().min(2, 'Father\'s name must be at least 2 characters'),
    fatherEmail: z.string().email('Invalid father\'s email address'),
    fatherPhone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number format'),
    fatherOccupation: z.string().min(2, 'Father\'s occupation must be at least 2 characters'),
    motherName: z.string().min(2, 'Mother\'s name must be at least 2 characters'),
    motherEmail: z.string().email('Invalid mother\'s email address'),
    motherPhone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number format'),
    motherOccupation: z.string().min(2, 'Mother\'s occupation must be at least 2 characters'),
    parentPassword: z.string()
        .min(8, 'Parent password must be at least 8 characters')
        .regex(/[A-Z]/, 'Parent password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Parent password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Parent password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Parent password must contain at least one special character'),

    // Student Password
    password: z.string()
        .min(8, 'Student password must be at least 8 characters')
        .regex(/[A-Z]/, 'Student password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Student password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Student password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Student password must contain at least one special character'),

    // Optional fields
    guardianType: z.enum(['Legal Guardian', 'Relative', 'Other']).optional(),
    guardianName: z.string().optional(),
    guardianRelation: z.string().optional(),
    guardianPhone: z.string().optional(),
    guardianEmail: z.string().email('Invalid guardian email address').optional(),
    guardianOccupation: z.string().optional(),
    guardianAddress: z.string().optional(),

    // Medical Information
    allergies: z.string().optional(),
    medicalCondition: z.string().optional(),
    medications: z.string().optional(),

    // Previous School Information
    previousSchoolName: z.string().optional(),
    previousSchoolAddress: z.string().optional(),

    // Sibling Information
    isSiblingStudyingInSameSchool: z.enum(['Yes', 'No']).optional(),
    siblingName: z.string().optional(),
    siblingRollNo: z.string().optional(),
    siblingAdmissionNo: z.string().optional(),
    siblingClass: z.string().optional()
});

export const validateStudentRegistrationData: RequestHandler = (req, res, next) => {
    try {
        // Validate the request body
        studentRegistrationSchema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));
            res.status(400).json({ message: 'Validation failed', errors });
        } else {
            res.status(400).json({ 
                message: 'Invalid request data', 
                error: error instanceof Error ? error.message : 'Unknown error' 
            });
        }
    }
};

// Library User Registration Schema
export const libraryUserRegistrationSchema = z.object({
    username: z.string()
        .min(3, { message: 'Username must be at least 3 characters long' })
        .max(50, { message: 'Username cannot exceed 50 characters' })
        .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' }),
    
    email: z.string()
        .email({ message: 'Invalid email address' })
        .max(100, { message: 'Email cannot exceed 100 characters' }),
    
    password: z.string()
        .min(8, { message: 'Password must be at least 8 characters long' })
        .max(100, { message: 'Password cannot exceed 100 characters' })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 
            { message: 'Password must include uppercase, lowercase, number, and special character' }),
    
    firstName: z.string()
        .min(2, { message: 'First name must be at least 2 characters long' })
        .max(50, { message: 'First name cannot exceed 50 characters' })
        .regex(/^[a-zA-Z]+$/, { message: 'First name can only contain letters' }),
    
    lastName: z.string()
        .min(2, { message: 'Last name must be at least 2 characters long' })
        .max(50, { message: 'Last name cannot exceed 50 characters' })
        .regex(/^[a-zA-Z]+$/, { message: 'Last name can only contain letters' }),
    
    role: z.enum(['student', 'staff', 'admin'], {
        errorMap: () => ({ message: 'Invalid role. Must be student, staff, or admin' })
    }).optional(),
    
    status: z.enum(['active', 'inactive']).optional().default('active')
});

export const validateLibraryUserRegistration = (req: Request, res: Response, next: NextFunction):void => {
    try {
        // Validate input using Zod
        libraryUserRegistrationSchema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Zod validation error
             res.status(400).json({
                message: 'Validation failed',
                errors: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
            return;
        }
        // If it's not a Zod error, pass it to the error handler
        next(error);
    }
};