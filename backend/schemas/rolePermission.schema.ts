// backend/schemas/rolePermission.schema.ts
import { z } from 'zod';

export const rolePermissionSchema = z.object({
    roleId: z
        .string().min(1, { message: 'Role ID is required' }),
    permissionId: z
        .string().min(1, { message: 'At least one permission ID is required' }),
});