// backend/middleware/studentMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { studentRegistrationSchema } from '../schemas/studentRegistrationSchema'; 
import { z } from 'zod';

export const validateStudentRegistration = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        
        const parsedData = studentRegistrationSchema.parse(req.body);

        
        req.body = parsedData;

        
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            
            res.status(400).json({
                message: "Validation failed",
                errors: error.errors,
            });
        } else {
            console.error("Unknown validation error:", error);
            
            res.status(500).json({
                message: "An unknown error occurred during validation.",
            });
        }
    }
};
