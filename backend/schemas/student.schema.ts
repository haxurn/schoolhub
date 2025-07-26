import { z } from 'zod';

export const createStudentSchema = z.object({
    body: z.object({
        firstName: z.string()
            .min(1, 'First name is required')
            .max(50, 'First name must be less than 50 characters')
            .regex(/^[a-zA-Z\s]+$/, 'First name must contain only letters and spaces'),
        
        lastName: z.string()
            .min(1, 'Last name is required')
            .max(50, 'Last name must be less than 50 characters')
            .regex(/^[a-zA-Z\s]+$/, 'Last name must contain only letters and spaces'),
        
        email: z.string()
            .email('Invalid email format')
            .optional()
            .or(z.literal('')),
        
        phone: z.string()
            .optional()
            .refine((val) => {
                if (!val) return true;
                return /^\+?[\d\s\-\(\)]+$/.test(val);
            }, 'Invalid phone number format'),
        
        dateOfBirth: z.string()
            .refine((val) => {
                const date = new Date(val);
                const now = new Date();
                const age = now.getFullYear() - date.getFullYear();
                return age >= 5 && age <= 25;
            }, 'Student must be between 5 and 25 years old'),
        
        address: z.string()
            .max(200, 'Address must be less than 200 characters')
            .optional(),
        
        grade: z.string()
            .min(1, 'Grade is required')
            .refine((val) => ['9', '10', '11', '12'].includes(val), 'Grade must be 9, 10, 11, or 12'),
        
        section: z.string()
            .optional()
            .refine((val) => {
                if (!val) return true;
                return /^[A-Z]$/.test(val);
            }, 'Section must be a single uppercase letter'),
        
        guardianName: z.string()
            .min(1, 'Guardian name is required')
            .max(100, 'Guardian name must be less than 100 characters')
            .regex(/^[a-zA-Z\s]+$/, 'Guardian name must contain only letters and spaces'),
        
        guardianPhone: z.string()
            .min(1, 'Guardian phone is required')
            .refine((val) => /^\+?[\d\s\-\(\)]+$/.test(val), 'Invalid guardian phone number format'),
        
        guardianEmail: z.string()
            .email('Invalid guardian email format')
            .optional()
            .or(z.literal('')),
        
        enrollmentDate: z.string()
            .optional()
            .refine((val) => {
                if (!val) return true;
                const date = new Date(val);
                return date <= new Date();
            }, 'Enrollment date cannot be in the future'),
    })
});

export const updateStudentSchema = z.object({
    body: z.object({
        firstName: z.string()
            .min(1, 'First name is required')
            .max(50, 'First name must be less than 50 characters')
            .regex(/^[a-zA-Z\s]+$/, 'First name must contain only letters and spaces')
            .optional(),
        
        lastName: z.string()
            .min(1, 'Last name is required')
            .max(50, 'Last name must be less than 50 characters')
            .regex(/^[a-zA-Z\s]+$/, 'Last name must contain only letters and spaces')
            .optional(),
        
        email: z.string()
            .email('Invalid email format')
            .optional()
            .or(z.literal('')),
        
        phone: z.string()
            .optional()
            .refine((val) => {
                if (!val) return true;
                return /^\+?[\d\s\-\(\)]+$/.test(val);
            }, 'Invalid phone number format'),
        
        dateOfBirth: z.string()
            .refine((val) => {
                if (!val) return true;
                const date = new Date(val);
                const now = new Date();
                const age = now.getFullYear() - date.getFullYear();
                return age >= 5 && age <= 25;
            }, 'Student must be between 5 and 25 years old')
            .optional(),
        
        address: z.string()
            .max(200, 'Address must be less than 200 characters')
            .optional(),
        
        grade: z.string()
            .refine((val) => {
                if (!val) return true;
                return ['9', '10', '11', '12'].includes(val);
            }, 'Grade must be 9, 10, 11, or 12')
            .optional(),
        
        section: z.string()
            .optional()
            .refine((val) => {
                if (!val) return true;
                return /^[A-Z]$/.test(val);
            }, 'Section must be a single uppercase letter'),
        
        status: z.enum(['ACTIVE', 'INACTIVE', 'GRADUATED', 'TRANSFERRED', 'SUSPENDED'])
            .optional(),
        
        guardianName: z.string()
            .min(1, 'Guardian name is required')
            .max(100, 'Guardian name must be less than 100 characters')
            .regex(/^[a-zA-Z\s]+$/, 'Guardian name must contain only letters and spaces')
            .optional(),
        
        guardianPhone: z.string()
            .refine((val) => {
                if (!val) return true;
                return /^\+?[\d\s\-\(\)]+$/.test(val);
            }, 'Invalid guardian phone number format')
            .optional(),
        
        guardianEmail: z.string()
            .email('Invalid guardian email format')
            .optional()
            .or(z.literal('')),
        
        enrollmentDate: z.string()
            .optional()
            .refine((val) => {
                if (!val) return true;
                const date = new Date(val);
                return date <= new Date();
            }, 'Enrollment date cannot be in the future'),
    })
});

export const studentQuerySchema = z.object({
    query: z.object({
        page: z.string()
            .optional()
            .refine((val) => {
                if (!val) return true;
                const num = parseInt(val);
                return !isNaN(num) && num > 0;
            }, 'Page must be a positive number'),
        
        limit: z.string()
            .optional()
            .refine((val) => {
                if (!val) return true;
                const num = parseInt(val);
                return !isNaN(num) && num > 0 && num <= 100;
            }, 'Limit must be between 1 and 100'),
        
        search: z.string()
            .max(100, 'Search term must be less than 100 characters')
            .optional(),
        
        grade: z.string()
            .optional()
            .refine((val) => {
                if (!val) return true;
                return ['9', '10', '11', '12'].includes(val);
            }, 'Grade must be 9, 10, 11, or 12'),
        
        status: z.enum(['ACTIVE', 'INACTIVE', 'GRADUATED', 'TRANSFERRED', 'SUSPENDED'])
            .optional(),
    })
});

// Type exports
export type CreateStudentInput = z.infer<typeof createStudentSchema>['body'];
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>['body'];
export type StudentQueryInput = z.infer<typeof studentQuerySchema>['query'];