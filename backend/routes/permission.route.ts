// backend/routes/permission.route.ts
import { Router } from 'express';
import {
    createPermissionController,
    deletePermissionController,
    getAllPermissionsController,
    getPermissionByIdController,
    updatePermissionController,
    createPermissionGroupController,
    deletePermissionGroupController,
    getAllPermissionGroupsController,
    getPermissionGroupByIdController,
    updatePermissionGroupController
} from '../controllers/permission.controller';
import { validate } from '../middlewares/validate.middleware';
import { permissionSchema, permissionGroupSchema } from '../schemas/permission.schema'; // Assuming you have a schema for permissions
import { Handler } from './../utils/handler.util';

const router = Router();

// Routes for Permissions
router.post('/permissions', validate(permissionSchema), Handler(createPermissionController));
router.get('/permissions', Handler(getAllPermissionsController));
router.get('/permissions/:id', Handler(getPermissionByIdController));
router.put('/permissions/:id', validate(permissionSchema), Handler(updatePermissionController));
router.delete('/permissions/:id', Handler(deletePermissionController));

// Routes for Permission Groups
router.post('/permissions-groups', validate(permissionGroupSchema), Handler(createPermissionGroupController));
router.get('/permissions-groups', Handler(getAllPermissionGroupsController));
router.get('/permissions-groups/:id', Handler(getPermissionGroupByIdController));
router.put('/permissions-groups/:id', validate(permissionGroupSchema), Handler(updatePermissionGroupController));
router.delete('/permissions-groups/:id', Handler(deletePermissionGroupController));

export default router;