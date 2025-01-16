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

export type LoginRequest = z.infer<typeof loginSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;