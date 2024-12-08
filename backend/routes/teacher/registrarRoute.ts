// backend/routes/teacher/registrarRoute.ts
import express from 'express';
import * as teacherController from '../../controllers/teacherController';
import { authMiddleware as authenticateJWT, staffAccess as authorizeRoles, adminOnly, teacherOnly, adminOrTeacher } from '../../middleware/authMiddleware';
import { upload as uploadMiddleware } from '../../middleware/fileUploadMiddleware';

const router = express.Router();

// Teacher Registration Route (Admin/Registrar Only)
router.post(
    '/register', 
    authenticateJWT,
    adminOnly,
    uploadMiddleware.fields([
        { name: 'image', maxCount: 1 },
        { name: 'resume', maxCount: 1 }
    ]),
    async (req, res, next) => {
        await teacherController.registerTeacher(req, res, next);
    }
);

// Update Teacher Profile
router.put(
    '/profile/:teacherId', 
    authenticateJWT,
    adminOrTeacher,
    uploadMiddleware.fields([
        { name: 'image', maxCount: 1 },
        { name: 'resume', maxCount: 1 }
    ]),
    async (req, res) => {
        await teacherController.updateTeacherProfile(req, res);
    }
);

// Get Teacher Details by ID
router.get(
    '/:teacherId', 
    authenticateJWT,
    authorizeRoles,
    async (req, res) => {
        await teacherController.getTeacherById(req, res);
    }
);

// List All Teachers
router.get(
    '/', 
    authenticateJWT,
    authorizeRoles,
    async (req, res, next) => {
        await teacherController.listTeachers(req, res, next);
    }
);

// Delete Teacher Account
router.delete(
    '/:teacherId', 
    adminOnly,
    authorizeRoles,
    async (req, res) => {
        await teacherController.deleteTeacher(req, res);
    }
);

export default router;
