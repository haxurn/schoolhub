import { Request, Response } from 'express';
import {
    createRole,
    deleteRole,
    getAllRoles,
    getRoleById,
    updateRole,
} from '../services/role.service';
import { AppError } from '../utils/appError.util';

// Create a new role
export const createRoleController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, description } = req.body; // Assuming validation is done in the route
        const newRole = await createRole(name, description);
        return res.status(201).json(newRole);
    } catch (error) {
        console.error('Error during role creation:', error);
        return res.status(500).json({ message: `${error}` });
    }
};

// Update a role
export const updateRoleController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const { name, description } = req.body; // Assuming validation is done in the route
        const updatedRole = await updateRole(id, name, description);
        return res.status(200).json(updatedRole);
    } catch (error) {
        console.error('Error during role update:', error);
        return res.status(500).json({ message: `${error}` });
    }
};

// Get all roles
export const getAllRolesController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const roles = await getAllRoles();
        return res.status(200).json(roles);
    } catch (error) {
        console.error('Error retrieving roles:', error);
        return res.status(500).json({ message: `${error}` });
    }
};

// Get a role by ID
export const getRoleByIdController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const role = await getRoleById(id);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        return res.status(200).json(role);
    } catch (error) {
        console.error('Error retrieving role:', error);
        return res.status(500).json({ message: `${error}` });
    }
};

// Delete a role
export const deleteRoleController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        await deleteRole(id);
        return res.status(204).send();
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error('Error during role deletion:', error);
        return res.status(500).json({ message: `${error}` });
    }
};