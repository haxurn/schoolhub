// backend/controllers/login.controller.ts

import { Request, Response } from 'express';
import { loginService } from '../services/login.service';

export const loginController = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const { accessToken, refreshToken, user } = await loginService(username, password);

        return res.status(200).json({
            accessToken,
            refreshToken,
            user,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('❌ Error during login:', error.message);
            throw new Error(error.message);
        } else {
            console.error('❌ Unknown error during login:', error);
            throw new Error('Internal server error');
        }
    }
};