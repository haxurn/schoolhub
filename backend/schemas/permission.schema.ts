// backend/schemas/permission.schema.ts
import { z } from 'zod';

export const permissionSchema = z.object({
    name: z.string().min(1, { message: 'Permission name is required' }),
    description: z.string().min(1, { message: 'Permission description is required' }),
    permissionGroupId: z.string().optional(),
});

export const permissionGroupSchema = z.object({
    name: z
         .string().min(1, { message: 'Permission group name is required'}),
    description: z
         .string().min(1, { message: 'Permission group description is required'}),
});