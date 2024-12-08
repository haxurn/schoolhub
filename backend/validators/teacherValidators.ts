// backend/validators/teacherValidators.ts
import { z } from 'zod';

// Regex for validation
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

// Enums for validation
const GENDER_ENUM = ['Male', 'Female', 'Other'] as const;
const BLOOD_GROUP_ENUM = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
const MARITAL_STATUS_ENUM = ['Single', 'Married', 'Divorced', 'Widowed'] as const;
const WORK_SHIFT_ENUM = ['Morning', 'Afternoon', 'Evening', 'Night'] as const;

export const teacherRegistrationSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name cannot exceed 50 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name cannot exceed 50 characters'),
    email: z.string().regex(EMAIL_REGEX, 'Invalid email format'),
    password: z.string().regex(PASSWORD_REGEX, 'Password must be at least 8 characters, include letters, numbers, and special characters'),
    phoneNumber: z.string().regex(PHONE_REGEX, 'Invalid phone number'),
    dateOfBirth: z.string().refine(date => {
        const age = new Date().getFullYear() - new Date(date).getFullYear();
        return age >= 21 && age <= 65;
    }, { message: 'Teacher must be between 21 and 65 years old' }),
    gender: z.enum(GENDER_ENUM, { 
        errorMap: () => ({ message: 'Invalid gender selection' }) 
    }),
    bloodGroup: z.enum(BLOOD_GROUP_ENUM, { 
        errorMap: () => ({ message: 'Invalid blood group selection' }) 
    }),
    address: z.string().min(1, 'Address must be at least 1 characters').max(255, 'Address cannot exceed 255 characters'),
    maritalStatus: z.enum(MARITAL_STATUS_ENUM, { 
        errorMap: () => ({ message: 'Invalid marital status selection' }) 
    }),
    qualification: z.string().min(2, 'Qualification must be at least 2 characters').max(255, 'Qualification cannot exceed 255 characters'),
    dateOfJoining: z.date().refine(date => {
        return !isNaN(date.getTime());
    }, { message: 'Invalid date format for dateOfJoining' }),
    workExperience: z.number().min(0, 'Work experience cannot be negative').max(50, 'Work experience cannot exceed 50 years'),
    previousWork: z.string().optional(),  
    previousWorkAddress: z.string().optional(),
    previousWorkPhoneNumber: z.string().regex(PHONE_REGEX, 'Invalid previous work phone number').optional(),
    workShift: z.enum(WORK_SHIFT_ENUM, { 
        errorMap: () => ({ message: 'Invalid work shift selection' }) 
    }),
    workLocation: z.string().min(2, 'Work location must be at least 2 characters').max(255, 'Work location cannot exceed 255 characters'),
    salary: z.number().min(0, 'Salary cannot be negative'),
    subject: z.string().min(2, 'Subject must be at least 2 characters').max(255, 'Subject cannot exceed 255 characters'),
    facebook: z.string().url('Invalid Facebook URL').optional(),
    instagram: z.string().url('Invalid Instagram URL').optional(),
    linkedin: z.string().url('Invalid LinkedIn URL').optional(),
    twitterUrl: z.string().url('Invalid Twitter URL').optional(),
    resume: z.string().optional(),
    image: z.string().optional(),
    isActive: z.boolean().default(true),
});

export const teacherLoginSchema = z.object({
    username: z.string().regex(USERNAME_REGEX, 'Invalid username format'),
    password: z.string().min(8, 'Password must be at least 8 characters long')
});

export const teacherProfileUpdateSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    dateOfBirth: z.date().optional(),
    gender: z.enum(['Male', 'Female', 'Other']).optional(),
    bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
    maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed']).optional(),
    workShift: z.enum(['Morning', 'Afternoon', 'Evening', 'Night']).optional(),
    workLocation: z.string().optional(),
    workExperience: z.number().optional(),
    subject: z.string().optional(),
    image: z.string().optional(),
    resume: z.string().optional(),
    salary: z.number().optional()
});

export type TeacherRegistration = z.infer<typeof teacherRegistrationSchema>;
export type TeacherLogin = z.infer<typeof teacherLoginSchema>;
export type TeacherProfileUpdate = z.infer<typeof teacherProfileUpdateSchema>;
