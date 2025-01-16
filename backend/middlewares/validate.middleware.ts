// backend/middlewares/validate.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const validate = (schema: any) => {
    return (req: Request, res: Response, next: NextFunction): any => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({ message: 'Validation error', errors: error.errors });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
}