// backend/middleware/teacherAuth.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DecodedToken, UserRole } from './roles';

export const teacherAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(403).json({ message: 'No token provided, authorization denied' });
        }

        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7, authHeader.length) : authHeader;

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
            
            if (decoded.role !== UserRole.TEACHER && decoded.role !== UserRole.ADMIN) {
                return res.status(403).json({ 
                    message: 'Access denied. Teacher or admin privileges required.',
                    requiredRoles: [UserRole.TEACHER, UserRole.ADMIN],
                    userRole: decoded.role
                });
            }

            (req as any).user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Token is not valid' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server Error' });
    }
};
