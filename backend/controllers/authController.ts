// backend/controllers/authController.ts

import { Request, Response } from 'express';
import { getAdminByUsername, comparePassword } from '../models/adminModel';
import jwt from 'jsonwebtoken';

export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        const admin = await getAdminByUsername(username);

        if (!admin) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }

        const isPasswordValid = await comparePassword(password, admin.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }

        const token = jwt.sign(
            { id: admin.id, username: admin.username, role: admin.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });

    } catch (error: any) {
        res.status(500).json({ message: 'Error logging in', error: error.message || error });
    }
};
