// backend/controllers/auth.controller.ts

import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginRequest } from '../interfaces/auth.interface';

const authService = new AuthService();

export class AuthController {
    async login(req: Request<unknown, unknown, LoginRequest>, res: Response) {
        try {
            const response = await authService.login(req.body);
            res.json(response);
        } catch (error: any) {
            if (error.message.includes('Invalid email/username or password')) {
                res.status(401).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }
}