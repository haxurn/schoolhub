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
        // Restructure the flat request body into nested objects
        const structuredData = {
            personalInfo: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                primaryContactNumber: req.body.primaryContactNumber,
                emailAddress: req.body.emailAddress,
                dateOfBirth: req.body.dateOfBirth,
                fathersName: req.body.fathersName,
                mothersName: req.body.mothersName,
                maritalStatus: req.body.maritalStatus
            },
            professionalInfo: {
                qualification: req.body.qualification,
                workExperience: Number(req.body.workExperience),
                dateOfJoining: req.body.dateOfJoining,
                contractType: req.body.contractType,
                workShift: req.body.workShift,
                workLocation: req.body.workLocation
            },
            addressInfo: {
                address: req.body.address,
                permanentAddress: req.body.permanentAddress
            },
            employmentInfo: {
                panNumber: req.body.panNumber,
                epfNumber: req.body.epfNumber,
                basicSalary: Number(req.body.basicSalary),
                medicalLeaves: Number(req.body.medicalLeaves),
                casualLeaves: Number(req.body.casualLeaves),
                maternityLeaves: Number(req.body.maternityLeaves),
                sickLeaves: Number(req.body.sickLeaves)
            },
            bankInfo: {
                accountName: req.body.accountName,
                accountNumber: req.body.accountNumber,
                bankName: req.body.bankName,
                ifscCode: req.body.ifscCode
            },
            authentication: {
                password: req.body.password,
                confirmPassword: req.body.confirmPassword
            }
        };

        const validatedData = financeRegistrarSchema.parse(structuredData);
        req.body.validatedData = validatedData;
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                message: 'Validation failed',
                errors: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
            return;
        }
        res.status(500).json({ message: 'Internal server error during validation' });
        return;
    }
};