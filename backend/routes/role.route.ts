import { Router } from 'express';
import {
    createRoleController,
    deleteRoleController,
    getAllRolesController,
    getRoleByIdController,
    updateRoleController
} from '../controllers/role.controller';
import {
    addPermissionsController,
    updatePermissionsController,
    removePermissionController,
    getPermissionsController
} from '../controllers/rolePermission.controller';
import { validate } from '../middlewares/validate.middleware';
import { roleSchema } from '../schemas/role.schema';
import { rolePermissionSchema } from '../schemas/rolePermission.schema';
import { Handler } from './../utils/handler.util';

const router = Router();

// Route to create a new role with validation
router.post('/roles', validate(roleSchema), Handler(createRoleController));

// Route to get all roles
router.get('/roles', Handler(getAllRolesController));

// Route to get a role by ID
router.get('/roles/:id', Handler(getRoleByIdController));

// Route to update a role by ID with validation
router.put('/roles/:id', validate(roleSchema), Handler(updateRoleController));

// Route to delete a role by ID
router.delete('/roles/:id', Handler(deleteRoleController));

// Route to add permissions to a role
router.post('/roles/permissions', validate(rolePermissionSchema), Handler(addPermissionsController));

// Route to get permissions for a role
router.get('/roles/:roleId/permissions', getPermissionsController);

// Route to remove a permission from a role
router.delete('/roles/:roleId/permissions/:permissionId', validate(rolePermissionSchema), Handler(removePermissionController));

// Route to update permissions for a role
router.put('/roles/:roleId/permissions', validate(rolePermissionSchema), Handler(updatePermissionsController));

export default router;