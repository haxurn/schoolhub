// backend/routes/attendanceRoutes.ts

import { Router } from 'express';
import { createAttendanceController, getAttendanceByIdController, getAllAttendancesController } from '../controllers/attendanceController';
import logger from '../middleware/logger';

const router = Router();

router.use(logger);

router.post('/attendance', createAttendanceController);
router.get('/attendance/:id', getAttendanceByIdController);
router.get('/attendances', getAllAttendancesController);

export default router;
