// backend/controllers/attendanceController.ts

import { Request, Response } from 'express';
import { createAttendance, getAttendanceById, getAllAttendances, Attendance } from '../models/attendanceModel';

// Create a new attendance record
export const createAttendanceController = async (req: Request, res: Response) => {
    try {
        const attendanceData: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'> = req.body;
        await createAttendance(attendanceData);
        res.status(201).json({ message: 'Attendance record created successfully' });
    } catch (error) {
        console.error('❌ Error creating attendance record:', error);
        res.status(500).json({ message: 'Failed to create attendance record' });
    }
};

// Get attendance by ID
export const getAttendanceByIdController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const attendance = await getAttendanceById(Number(id));
        if (!attendance) {
            res.status(404).json({ message: 'Attendance record not found' });
            return 
        }
        res.status(200).json(attendance);
    } catch (error) {
        // file deepcode ignore FormatString: <please specify a reason of ignoring this>
        console.error(`❌ Error fetching attendance record with ID ${req.params.id}:`, error);
        res.status(500).json({ message: 'Failed to fetch attendance record' });
    }
};

// Get all attendance records
export const getAllAttendancesController = async (_req: Request, res: Response) => {
    try {
        const attendances = await getAllAttendances();
        res.status(200).json(attendances);
    } catch (error) {
        console.error('❌ Error fetching attendance records:', error);
        res.status(500).json({ message: 'Failed to fetch attendance records' });
    }
};
