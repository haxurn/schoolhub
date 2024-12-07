// backend/models/guardiansModel.ts

import { db } from '../config/dbConfig';
import { guardiansTable } from '../db/tables';
import { eq } from 'drizzle-orm';

interface Guardian {
    id: number;
    studentId: number;
    guardianType: string;
    guardianName: string;
    guardianRelation: string;
    guardianPhone: string;
    guardianEmail: string;
    guardianOccupation: string;
    guardianAddress: string;
    guardianUpload?: string;
    createdAt: Date;
    updatedAt: Date;
}

export const getGuardianByStudentId = async (studentId: number): Promise<Guardian | null> => {
    try {
        const result = await db
            .select({
                id: guardiansTable.id,
                studentId: guardiansTable.studentId,
                guardianType: guardiansTable.guardianType,
                guardianName: guardiansTable.guardianName,
                guardianRelation: guardiansTable.guardianRelation,
                guardianPhone: guardiansTable.guardianPhone,
                guardianEmail: guardiansTable.guardianEmail,
                guardianOccupation: guardiansTable.guardianOccupation,
                guardianAddress: guardiansTable.guardianAddress,
                guardianUpload: guardiansTable.guardianUpload,
                createdAt: guardiansTable.createdAt,
                updatedAt: guardiansTable.updatedAt,
            })
            .from(guardiansTable)
            .where(eq(guardiansTable.studentId, studentId))
            .limit(1)
            .execute();

        if (result.length === 0) {
            console.warn(`⚠️ No guardian found with student ID: ${studentId}`);
            return null;
        }

        return result[0] as Guardian;
    } catch (error) {
        console.error(`❌ Error fetching guardian by student ID (${studentId}):`, error);
        throw new Error('Error fetching guardian from database');
    }
};
