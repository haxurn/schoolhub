// backend/utils/token.util.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string; 

export const generateToken = (userId: string, roleName: string): string => {
    return jwt.sign({ userId, role: roleName }, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string): string | jwt.JwtPayload => {
    return jwt.verify(token, JWT_SECRET);
};