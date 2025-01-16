import { Request, Response } from 'express';
import {
    addPermissionsToRole,
    getPermissionsForRole,
    removePermissionFromRole,
    updatePermissionsForRole
} from '../services/rolePermission.service';

export const addPermissionsController = async (req: Request, res: Response) => {
    const { roleId, permissionIds } = req.body;

    try {
        await addPermissionsToRole(roleId, permissionIds);
        res.status(201).json({ message: 'Permissions added successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getPermissionsController = async (req: Request, res: Response) => {
    const { roleId } = req.params;

    try {
        const permissions = await getPermissionsForRole(roleId);
        res.status(200).json(permissions);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const removePermissionController = async (req: Request, res: Response) => {
    const { roleId, permissionId } = req.params;

    try {
        await removePermissionFromRole(roleId, permissionId);
        res.status(200).json({ message: 'Permission removed successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
export const updatePermissionsController = async (req: Request, res: Response) => {
    const { roleId } = req.params;
    const { addPermissionIds, removePermissionIds } = req.body;

    try {
        await updatePermissionsForRole(roleId, addPermissionIds || [], removePermissionIds || []);
        res.status(200).json({ message: 'Permissions updated successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};