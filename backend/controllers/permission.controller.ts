import { Request, Response } from 'express';
import {
    createPermission,
    getAllPermissions,
    getPermissionById,
    updatePermission,
    deletePermission,
    createPermissionGroup,
    getAllPermissionGroups,
    getPermissionGroupById,
    updatePermissionGroup,
    deletePermissionGroup
} from '../services/permission.service';

// Create a new permission
export const createPermissionController = async (req: Request, res: Response): Promise<Response> => {
    const { name, description, permissionGroupId } = req.body;
    try {
        const newPermission = await createPermission(name, description, permissionGroupId);
        return res.status(201).json(newPermission);
    } catch (error) {
        console.error('Error creating permission:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all permissions
export const getAllPermissionsController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const permissions = await getAllPermissions();
        return res.status(200).json(permissions);
    } catch (error) {
        console.error('Error retrieving permissions:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Get a permission by ID
export const getPermissionByIdController = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const permission = await getPermissionById(id);
        if (!permission) {
            return res.status(404).json({ message: 'Permission not found' });
        }
        return res.status(200).json(permission);
    } catch (error) {
        console.error('Error retrieving permission:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a permission
export const updatePermissionController = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { name, description, permissionGroupId } = req.body;
    try {
        const updatedPermission = await updatePermission(id, permissionGroupId, name, description);
        return res.status(200).json(updatedPermission);
    } catch (error) {
        console.error('Error updating permission:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a permission
export const deletePermissionController = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        await deletePermission(id);
        return res.status(204).send(); // No content to return on successful deletion
    } catch (error) {
        console.error('Error deleting permission:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Create a new permission group
export const createPermissionGroupController = async (req: Request, res: Response): Promise<Response> => {
    const { name, description } = req.body;
    try {
        const newPermissionGroup = await createPermissionGroup(name, description);
        return res.status(201).json(newPermissionGroup);
    } catch (error) {
        console.error('Error creating permission group:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all permission groups
export const getAllPermissionGroupsController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const permissionGroups = await getAllPermissionGroups();
        return res.status(200).json(permissionGroups);
    } catch (error) {
        console.error('Error retrieving permission groups:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Get a permission group by ID
export const getPermissionGroupByIdController = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const permissionGroup = await getPermissionGroupById(id);
        if (!permissionGroup) {
            return res.status(404).json({ message: 'Permission group not found' });
        }
        return res.status(200).json(permissionGroup);
    } catch (error) {
        console.error('Error retrieving permission group:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a permission group
export const updatePermissionGroupController = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const updatedPermissionGroup = await updatePermissionGroup(id, name, description);
        return res.status(200).json(updatedPermissionGroup);
    } catch (error) {
        console.error('Error updating permission group:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a permission group
export const deletePermissionGroupController = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        await deletePermissionGroup(id);
        return res.status(204).send(); // No content to return on successful deletion
    } catch (error) {
        console.error('Error deleting permission group:', error);
        return res.status(500).json({ message: `${error}` });
    }
};