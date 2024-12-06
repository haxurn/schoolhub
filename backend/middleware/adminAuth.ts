// backend/middleware/adminAuth.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DecodedToken, UserRole } from './roles';

export const adminAuth = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            res.status(403).json({ message: 'No token provided, authorization denied' });
            return 
        }

        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7, authHeader.length) : authHeader;

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
            
            if (decoded.role !== UserRole.ADMIN) {
                 res.status(403).json({ 
                    message: 'Access denied. Admin privileges required.',
                    requiredRole: UserRole.ADMIN,
                    userRole: decoded.role
                });
                return
            }

            (req as any).user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Token is not valid' });
            return 
        }
    } catch (error) {
         res.status(500).json({ message: 'Server Error' });
         return
    }
};
