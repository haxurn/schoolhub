// backend/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { login } from '../services/auth.service';

export const loginController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response = await login(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: `${error}` });
    }
};

