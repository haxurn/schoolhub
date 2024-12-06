// backend/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DecodedToken, UserRole } from './roles';

// Base authentication middleware
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            res.status(403).json({ message: 'No token provided, authorization denied' });
            return;
        }

        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7, authHeader.length) : authHeader;

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
            (req as any).user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Token is not valid' });
            return;
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
        return;
    }
};

// Role-based middleware factory
export const requireRoles = (allowedRoles: UserRole[], checkType: 'ANY' | 'ALL' = 'ANY') => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const authHeader = req.headers['authorization'];
            if (!authHeader) {
                res.status(403).json({ message: 'No token provided, authorization denied' });
                return;
            }

            const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7, authHeader.length) : authHeader;

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
                
                // Admin has access to everything
                if (decoded.role === UserRole.ADMIN) {
                    (req as any).user = decoded;
                    next();
                    return;
                }

                // Check if user's role matches the requirements
                const hasAccess = checkType === 'ANY' 
                    ? allowedRoles.includes(decoded.role)
                    : allowedRoles.every(role => decoded.role === role);

                if (!hasAccess) {
                    res.status(403).json({ 
                        message: 'Access denied. Insufficient permissions.',
                        requiredRoles: allowedRoles,
                        userRole: decoded.role,
                        accessType: checkType
                    });
                    return;
                }

                (req as any).user = decoded;
                next();
            } catch (error) {
                res.status(401).json({ message: 'Token is not valid' });
                return;
            }
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
            return;
        }
    };
};

// Single role middleware
export const adminOnly = requireRoles([UserRole.ADMIN]);
export const teacherOnly = requireRoles([UserRole.TEACHER]);
export const studentOnly = requireRoles([UserRole.STUDENT]);
export const parentOnly = requireRoles([UserRole.PARENT]);
export const libraryOnly = requireRoles([UserRole.LIBRARY_STAFF]);
export const financeOnly = requireRoles([UserRole.FINANCE]);

// Combined roles with ANY access (OR condition)
export const adminOrFinance = requireRoles([UserRole.ADMIN, UserRole.FINANCE], 'ANY');
export const teacherOrAdmin = requireRoles([UserRole.TEACHER, UserRole.ADMIN], 'ANY');
export const studentOrParent = requireRoles([UserRole.STUDENT, UserRole.PARENT], 'ANY');

// Combined roles with ALL access (AND condition)
export const requireAllRoles = (roles: UserRole[]) => requireRoles(roles, 'ALL');

// Predefined role combinations
export const academicAccess = requireRoles([UserRole.ADMIN, UserRole.TEACHER], 'ANY');
export const staffAccess = requireRoles([
    UserRole.ADMIN, 
    UserRole.TEACHER, 
    UserRole.LIBRARY_STAFF, 
    UserRole.FINANCE
], 'ANY');