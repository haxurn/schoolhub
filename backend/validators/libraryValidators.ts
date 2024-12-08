import { z } from 'zod';

export const libraryUserRegistrationSchema = z.object({
    username: z.string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(50, { message: "Username cannot exceed 50 characters" })
        .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
    
    email: z.string()
        .email({ message: "Invalid email address" })
        .max(100, { message: "Email cannot exceed 100 characters" }),
    
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(100, { message: "Password cannot exceed 100 characters" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 
            { message: "Password must include uppercase, lowercase, number, and special character" }),
    
    firstName: z.string()
        .min(2, { message: "First name must be at least 2 characters long" })
        .max(50, { message: "First name cannot exceed 50 characters" })
        .regex(/^[a-zA-Z]+$/, { message: "First name can only contain letters" }),
    
    lastName: z.string()
        .min(2, { message: "Last name must be at least 2 characters long" })
        .max(50, { message: "Last name cannot exceed 50 characters" })
        .regex(/^[a-zA-Z]+$/, { message: "Last name can only contain letters" }),
    
    role: z.enum(['student', 'staff', 'admin'], {
        errorMap: () => ({ message: "Invalid role. Must be student, staff, or admin" })
    }).optional()
});

export const libraryUserLoginSchema = z.object({
    username: z.string(),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(100, { message: "Password cannot exceed 100 characters" })
});
