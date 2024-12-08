// backend/routes/teacher/authRoute.ts
import express from 'express';
import * as teacherController from '../../controllers/teacherController';
import { authMiddleware as authenticateJWT, staffAccess as authorizeRoles } from '../../middleware/authMiddleware';

const router = express.Router();

// Teacher Login Route
router.post('/login', teacherController.loginTeacher);

// Teacher Logout Route (JWT token invalidation)
router.post('/logout', authenticateJWT, (req, res) => {
    // In a JWT system, logout is typically handled client-side by removing the token
    res.status(200).json({ 
        message: 'Logout successful',
        details: 'Token should be removed client-side'
    });
});

// Password Reset Request Route
router.post('/password-reset-request', teacherController.requestPasswordReset);

// Password Reset Confirmation Route
router.post('/password-reset-confirm', teacherController.confirmPasswordReset);

// Get Current User Profile
router.get('/profile', 
    authenticateJWT, 
    authorizeRoles, 
    teacherController.getCurrentTeacherProfile
);

export default router;
