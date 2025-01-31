// backend/routes/auditLog.route.ts

import express from 'express';
import { fetchAuditLogsController } from '../controllers/auditLog.controller'; // Adjust the import based on your project structure

const router = express.Router();

// Route to fetch audit logs
router.get('/logs', fetchAuditLogsController);

export default router;