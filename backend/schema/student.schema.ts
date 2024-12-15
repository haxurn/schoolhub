// backend/schema/student.schema.ts 

// TODO: Add student schema
import { z } from 'zod';

export const registerSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    rollNumber: z.number().optional(),
    classId: z.string(),
    section: z.string().optional(),
    guardianId: z.string().optional(),
    branchId: z.string(),
    userId: z.string(),
    hasSiblings: z.boolean(),
    siblingOfId: z.string().optional(),
    status: z.enum(['Active', 'Inactive', 'Suspended'])
})

