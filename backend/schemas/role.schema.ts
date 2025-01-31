// backend/schemas/role.schema.ts
import { z } from 'zod';

export const roleSchema = z.object({
    name: z
         .string().min(1, { message: 'Role name is required'}),
    description: z
         .string().min(1, { message: 'Role description is required'}),
})

export type RoleInput = z.infer<typeof roleSchema>;