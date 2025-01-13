// backend/schemas/user.schema.ts
import { z } from 'zod';

// Login schema for validating user credentials
const loginSchema = z.object({
    identifier: z
        .string({ message: 'Username or Email is required' })
        .min(1, { message: "Username or Email shouldn't be empty" }),
    password: z
        .string({ message: 'Password is required' })
        .min(1, { message: "Password shouldn't be empty" }),
});

// Export the schemas
export default {
    loginSchema,
};