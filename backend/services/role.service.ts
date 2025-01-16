import { prisma } from '../configs/db.config';
import { Role } from '@prisma/client';
import { AppError } from '../utils/appError.util'; 
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// Function to create a new role
export const createRole = async (name: string, description: string): Promise<Role> => {
    try {
        const newRole = await prisma.role.create({
            data: {
                name,
                description,
            },
        });
        return newRole;
    } catch (error) {
        throw new AppError('Failed to create role', 500);
    }
};

export const getAllRoles = async (): Promise<Role[]> => {
    try {
        return await prisma.role.findMany();
    } catch (error) {
        throw new AppError('Failed to retrieve roles', 500);
    }
};

export const getRoleById = async (id: string): Promise<Role | null> => {
    try {
        return await prisma.role.findUnique({
            where: { id },
        });
    } catch (error) {
        throw new AppError('Failed to retrieve role', 500);
    }
};

// Function to update a role
export const updateRole = async (id: string, name: string, description: string): Promise<Role> => {
    try {
        return await prisma.role.update({
            where: { id },
            data: {
                name,
                description,
            },
        });
    } catch (error) {
        throw new AppError('Failed to update role', 500);
    }
};

export const deleteRole = async (id: string): Promise<void> => {
    try {
        await prisma.role.delete({
            where: { id },
        });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            throw new AppError(`Role with ID ${id} does not exist.`, 404);
        }
        throw new AppError('Failed to delete role', 500);
    }
};