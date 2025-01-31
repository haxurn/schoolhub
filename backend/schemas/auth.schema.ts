// backend/schemas/auth.schema.ts
import { z } from 'zod';

export const loginSchema = z.object({
    username: z.
        string().min(1, { message: 'Username is required' }),
    password: z.
        string().min(8, { message: 'Password is required' })
});

export const loginResponseSchema = z.object({
    token: z.string(),
    user: z.object({
        id: z.string(),
        username: z.string(),
        email: z.string().optional(),
        name: z.string(),
        image: z.string().nullable().optional(),
    }),
});

// Password Reset Request Schema
export const passwordResetRequestSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
});

// Password Reset Schema
export const passwordResetSchema = z.object({
    token: z.string().min(1, { message: 'Token is required' }),
    newPassword: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

export type LoginRequest = z.infer<typeof loginSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;