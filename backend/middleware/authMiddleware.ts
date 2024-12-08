import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DecodedToken, UserRole } from './roles';

// Extend the Request interface to include the user property
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
                role: string;
                username?: string;
            }
        }
    }
}

const sendErrorResponse = (
    res: Response,
    status: number,
    message: string,
    details: Record<string, any> = {}
) => res.status(status).json({ message, ...details });

const extractToken = (authHeader: string | undefined): string | null => {
    if (!authHeader) return null;
    return authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = extractToken(authHeader);

    if (!token) {
        sendErrorResponse(res, 403, 'No token provided, authorization denied');
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
        (req as any).user = decoded;
        next();
    } catch (error) {
        if (error instanceof Error) {
            sendErrorResponse(res, 401, 'Token is not valid', { error: error.message });
        } else {
            sendErrorResponse(res, 401, 'Token is not valid', { error: 'Unknown error occurred' });
        }
    }
};

// Role-based middleware factory
export const requireRoles = (allowedRoles: UserRole[], checkType: 'ANY' | 'ALL' = 'ANY') => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const authHeader = req.headers['authorization'];
        const token = extractToken(authHeader);

        if (!token) {
            sendErrorResponse(res, 403, 'No token provided, authorization denied');
            return;
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

            if (decoded.role === UserRole.ADMIN) {
                (req as any).user = decoded;
                next();
                return;
            }

            const hasAccess =
                checkType === 'ANY'
                    ? allowedRoles.includes(decoded.role)
                    : allowedRoles.every(role => decoded.role === role);

            if (!hasAccess) {
                sendErrorResponse(res, 403, 'Access denied. Insufficient permissions.', {
                    requiredRoles: allowedRoles,
                    userRole: decoded.role,
                    accessType: checkType,
                });
                return;
            }

            (req as any).user = decoded;
            next();
        } catch (error) {
            if (error instanceof Error) {
                sendErrorResponse(res, 401, 'Token is not valid', { error: error.message });
            } else {
                sendErrorResponse(res, 401, 'Token is not valid', { error: 'Unknown error occurred' });
            }
        }
    };
};

export const adminOnly = requireRoles([UserRole.ADMIN]);
export const teacherOnly = requireRoles([UserRole.TEACHER]);
export const studentOnly = requireRoles([UserRole.STUDENT]);
export const parentOnly = requireRoles([UserRole.PARENT]);
export const libraryOnly = requireRoles([UserRole.LIBRARY_STAFF]);
export const financeOnly = requireRoles([UserRole.FINANCE]);

export const adminOrFinance = requireRoles([UserRole.ADMIN, UserRole.FINANCE], 'ANY');
export const adminOrTeacher = requireRoles([UserRole.ADMIN, UserRole.TEACHER], 'ANY');
export const adminOrLibrary = requireRoles([UserRole.ADMIN, UserRole.LIBRARY_STAFF], 'ANY');
export const teacherOrAdmin = requireRoles([UserRole.TEACHER, UserRole.ADMIN], 'ANY');
export const studentOrParent = requireRoles([UserRole.STUDENT, UserRole.PARENT], 'ANY');

export const requireAllRoles = (roles: UserRole[]) => requireRoles(roles, 'ALL');

export const academicAccess = requireRoles([UserRole.ADMIN, UserRole.TEACHER], 'ANY');
export const staffAccess = requireRoles(
    [UserRole.ADMIN, UserRole.TEACHER, UserRole.LIBRARY_STAFF, UserRole.FINANCE, UserRole.STUDENT, UserRole.PARENT],
    'ANY'
);

export const authenticateLibraryUser = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
             res.status(401).json({ 
                message: 'No authorization token provided' 
            });
            return
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            res.status(401).json({ 
                message: 'Token must be in Bearer format' 
            });
            return 
        }

        const token = parts[1];

        const secret = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(token, secret) as { 
            id: number; 
            email: string; 
            role: string;
            exp: number;
        };

        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTimestamp) {
            res.status(401).json({ 
                message: 'Token has expired' 
            });
            return
        }

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };

        next();
    } catch (error) {
        console.error('❌ Library user authentication error:', error);

        if (error instanceof jwt.TokenExpiredError) {
             res.status(401).json({ 
                message: 'Token has expired' 
            });
            return
        }

        if (error instanceof jwt.JsonWebTokenError) {
             res.status(401).json({ 
                message: 'Invalid token' 
            });
            return

        }

        res.status(500).json({ 
            message: 'Authentication failed', 
            error: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
};

export const authorizeLibraryUser = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return res.status(401).json({ 
                    message: 'Authentication required' 
                });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ 
                    message: 'Access denied: Insufficient permissions' 
                });
            }

            next();
        } catch (error) {
            console.error('❌ Library user authorization error:', error);
            res.status(500).json({ 
                message: 'Authorization failed', 
                error: error instanceof Error ? error.message : 'Unknown error' 
            });
        }
    };
};
