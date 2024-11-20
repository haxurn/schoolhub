// backend/schemas/studentRegistrationSchema.ts
import { z } from 'zod';

const phoneRegex = /^\+?(\d{1,3})?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/;

export const studentRegistrationSchema = z.object({
    fullName: z.string().max(100),
    gender: z.string().max(10),
    previousGradeCertificate: z.string().max(255),
    birthdate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format." }),
    age: z.number().min(5, "Age must be at least 5"),
    bloodType: z.string().max(5),
    applyingGrade: z.number().min(1, "Grade must be a positive number"),
    address: z.object({
        houseNumber: z.string().min(1, "House number is required"),
        street: z.string(),
        subCity: z.string(),
        zone: z.string(),
    }),
    parentInfo: z.object({
        father: z.object({
            fullName: z.string(),
            phoneNumber: z.string().regex(phoneRegex, "Invalid phone number format"),
            email: z.string().email("Invalid email format"),
            job: z.string(),
            workplaceAddress: z.string(),
            photo: z.string(),
            nationality: z.string(),
        }),
        mother: z.object({
            fullName: z.string(),
            phoneNumber: z.string().regex(phoneRegex, "Invalid phone number format"),
            email: z.string().email("Invalid email format"),
            job: z.string(),
            workplaceAddress: z.string(),
            photo: z.string(),
            nationality: z.string(),
        }),
    }),
    nationality: z.string().min(2, "Nationality is required"),
});

export const studentLoginSchema = z.object({
    studentIdNumber: z.string().min(6, "Student ID number must be at least 6 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const parentLoginSchema = z.object({
    parentEmail: z.string().email("Invalid email format"),
    parentPassword: z.string().min(6, "Password must be at least 6 characters long"),
});
