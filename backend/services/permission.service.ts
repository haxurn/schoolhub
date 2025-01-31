import { prisma } from '../configs/db.config';
import { Permission, PermissionGroup } from '@prisma/client';
import { AppError } from '../utils/appError.util'; 
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// Create a new permission
export const createPermission = async (name: string, description: string, permissionGroupId?: string): Promise<Permission> => {
    try {
        const newPermission = await prisma.permission.create({
            data: {
                name,
                description,
                // Only connect to permission group if permissionGroupId is provided
                ...(permissionGroupId ? { permissionGroup: { connect: { id: permissionGroupId } } } : {}),
            },
        });
        return newPermission;
    } catch (error) {
        throw new AppError('Failed to create permission', 500);
    }
};

// Get all permissions
export const getAllPermissions = async (): Promise<Permission[]> => {
    try {
        return await prisma.permission.findMany();
    } catch (error) {
        throw new AppError('Failed to retrieve permissions', 500);
    }
};

// Get a permission by id
export const getPermissionById = async (id: string): Promise<Permission | null> => {
    try {
        return await prisma.permission.findUnique({
            where: { id },
        });
    } catch (error) {
        throw new AppError('Failed to retrieve permission', 500);
    }
};

// Update a permission
export const updatePermission = async (id: string, name: string, description: string, permissionGroupId?: string): Promise<Permission> => {
    try {
        return await prisma.permission.update({
            where: { id },
            data: {
                name,
                description,
                // Only connect to permission group if permissionGroupId is provided
                ...(permissionGroupId ? { permissionGroup: { connect: { id: permissionGroupId } } } : {}),
            },
        });
    } catch (error) {
        throw new AppError('Failed to update permission', 500);
    }
};

// Delete a permission
export const deletePermission = async (id: string): Promise<Permission> => {
    try {
        return await prisma.permission.delete({
            where: { id },
        });
    } catch (error) {
        throw new AppError('Failed to delete permission', 500);
    }
};

// Create a new permission group
export const createPermissionGroup = async (name: string, description: string): Promise<PermissionGroup> => {
    try {
        return await prisma.permissionGroup.create({
            data: {
                name,
                description,
            },
        });
    } catch (error) {
        throw new AppError('Failed to create permission group', 500);
    }
};

// Get all permission groups
export const getAllPermissionGroups = async (): Promise<PermissionGroup[]> => {
    try {
        return await prisma.permissionGroup.findMany();
    } catch (error) {
        throw new AppError('Failed to retrieve permission groups', 500);
    }
};

// Get a permission group by id
export const getPermissionGroupById = async (id: string): Promise<PermissionGroup | null> => {
    try {
        return await prisma.permissionGroup.findUnique({
            where: { id },
        });
    } catch (error) {
        throw new AppError('Failed to retrieve permission group', 500);
    }
};

// Update a permission group
export const updatePermissionGroup = async (id: string, name: string, description: string): Promise<PermissionGroup> => {
    try {
        return await prisma.permissionGroup.update({
            where: { id },
            data: {
                name,
                description,
            },
        });
    } catch (error) {
        throw new AppError('Failed to update permission group', 500);
    }
};

// Delete a permission group
export const deletePermissionGroup = async (id: string): Promise<PermissionGroup> => {
    try {
        return await prisma.permissionGroup.delete({
            where: { id },
        });
    } catch (error) {
        if(error instanceof PrismaClientKnownRequestError) {
            throw new AppError(`Permission group with ID ${id} does not exist.`, 404);
        }
        throw new AppError('Failed to delete permission group', 500);
    }
};