// backend/services/auditLog.service.ts
import { prisma } from '../configs/db.config'; 
import { AuditLog } from '@prisma/client';

export const getAuditLogs = async (userId?: string, actionType?: string): Promise<AuditLog[]> => {
    const where: any = {};
    if (userId) {
        where.userId = userId;
    }
    if (actionType) {
        where.targetType = actionType;
    }

    return await prisma.auditLog.findMany({
        where,
        orderBy: {
            timestamp: 'desc',
        },
    });
};

