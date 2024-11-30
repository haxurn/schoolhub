import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config({ path: '../.env' });


export const verifyAdminToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        res.status(403).json({ message: 'No token provided, authorization denied' });
        return 
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7, authHeader.length) : authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.body.adminId = (decoded as any).id;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Failed to authenticate token', error });
    }
};
 