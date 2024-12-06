// backend/controllers/classController.ts

import { Request, Response } from 'express';
import { createClass, getClassById, getAllClasses, Class } from '../models/classModel';

// Create a new class
export const createClassController = async (req: Request, res: Response) => {
    try {
        const classData: Omit<Class, 'id' | 'createdAt' | 'updatedAt'> = req.body;
        await createClass(classData);
        res.status(201).json({ message: 'Class created successfully' });
    } catch (error) {
        console.error('❌ Error creating class:', error);
        res.status(500).json({ message: 'Failed to create class' });
    }
};

// Get class by ID
export const getClassByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const classItem = await getClassById(Number(id));
        if (!classItem) {
            return res.status(404).json({ message: 'Class not found' });
        }
        res.status(200).json(classItem);
    } catch (error) {
        // file deepcode ignore FormatString: <please specify a reason of ignoring this>
        console.error(`❌ Error fetching class with ID ${req.params.id}:`, error);
        res.status(500).json({ message: 'Failed to fetch class' });
    }
};

// Get all classes
export const getAllClassesController = async (_req: Request, res: Response) => {
    try {
        const classes = await getAllClasses();
        res.status(200).json(classes);
    } catch (error) {
        console.error('❌ Error fetching classes:', error);
        res.status(500).json({ message: 'Failed to fetch classes' });
    }
};
