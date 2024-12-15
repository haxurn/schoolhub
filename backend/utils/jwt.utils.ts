// backend/utils/jwt.utils.ts
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { JWT_SECRET, JWT_EXPIRY, REFRESH_SECRET, REFRESH_EXPIRY } = process.env;


export const generateAccessToken = (payload: object) => {
    return jwt.sign(payload, JWT_SECRET as string, { expiresIn: JWT_EXPIRY });
}

export const generateRefreshToken = (payload: object) => {
    return jwt.sign(payload, REFRESH_SECRET as string, { expiresIn: REFRESH_EXPIRY });
}


export const verifyAccessToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET as string) as JwtPayload;
    } catch (error) {
        console.error('❌ Error verifying access token:', error);
        return null;
    }
};