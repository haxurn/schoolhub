// controllers/auditLog.controller.ts
import { Request, Response } from 'express';
import { getAuditLogs } from '../services/auditLog.service'; 

export const fetchAuditLogsController = async (req: Request, res: Response) => {
    const { userId, actionType } = req.query; // Get query parameters
    try {
        const logs = await getAuditLogs(userId as string, actionType as string);
        res.status(200).json(logs);
    } catch (error: any) {
        console.error('Error fetching audit logs:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

