import { prisma } from '../configs/db.config';
import { AppError } from '../utils/appError.util';
import { Permission } from '@prisma/client';

// Add permissions to a role
export const addPermissionsToRole = async (roleId: string, permissionIds: string[]): Promise<void> => {
    if (!roleId || permissionIds.length === 0) {
        throw new AppError('Role ID and permission IDs are required', 400);
    }

    try {
        const rolePermissions = permissionIds.map(permissionId => ({
            roleId,
            permissionId,
        }));

        await prisma.rolePermissions.createMany({
            data: rolePermissions,
        });
    } catch (error) {
        throw new AppError('Failed to add permissions to role', 500);
    }
};

// Get permissions for a role
export const getPermissionsForRole = async (roleId: string): Promise<Permission[]> => {
    if (!roleId) {
        throw new AppError('Role ID is required', 400);
    }

    try {
        const roleWithPermissions = await prisma.role.findUnique({
            where: { id: roleId },
            include: {
                rolePermissions: {
                    include: {
                        permission: true, // Include the associated permission
                    },
                },
            },
        });

        if (!roleWithPermissions) {
            throw new AppError('Role not found', 404);
        }

        // Extract permissions from rolePermissions
        return roleWithPermissions.rolePermissions.map(rp => rp.permission) || [];
    } catch (error) {
        throw new AppError('Failed to retrieve permissions for role', 500);
    }
};

// Remove a permission from a role
export const removePermissionFromRole = async (roleId: string, permissionId: string): Promise<void> => {
    if (!roleId || !permissionId) {
        throw new AppError('Role ID and permission ID are required', 400);
    }

    try {
        await prisma.rolePermissions.delete({
            where: {
                roleId_permissionId: {
                    roleId,
                    permissionId,
                },
            },
        });
    } catch (error) {
        throw new AppError('Failed to remove permission from role', 500);
    }
};

// Update permissions for a role
export const updatePermissionsForRole = async (roleId: string, addPermissionIds: string[], removePermissionIds: string[]): Promise<void> => {
    if (!roleId) {
        throw new AppError('Role ID is required', 400);
    }

    try {
        // Remove specified permissions
        if (removePermissionIds && removePermissionIds.length > 0) {
            for (const permissionId of removePermissionIds) {
                await removePermissionFromRole(roleId, permissionId);
            }
        }

        // Add specified permissions
        if (addPermissionIds && addPermissionIds.length > 0) {
            await addPermissionsToRole(roleId, addPermissionIds);
        }
    } catch (error) {
        throw new AppError('Failed to update permissions for role', 500);
    }
};