// backend/routes/index.ts

import express from 'express';
import studentAuthRoutes from './student/authRoutes';
import studentRegisterRoutes from './student/registerRoutes';
import adminAuthRoutes from './admin/authRoute';
import financeAuthRoutes from './finance/authRoute';
import financeRegistrarRoutes from './finance/registrarRoute';
import parentAuthRoutes from './parent/authRoute';

const router = express.Router();

// Student routes
router.use('/student', studentAuthRoutes);
router.use('/student', studentRegisterRoutes);

// Admin routes
router.use('/admin', adminAuthRoutes);

// Finance routes
router.use('/finance', financeAuthRoutes);
router.use('/finance', financeRegistrarRoutes);

// Parent routes
router.use('/parent', parentAuthRoutes);

export default router;