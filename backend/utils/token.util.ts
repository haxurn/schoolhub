// backend/utils/token.util.ts

import jwt from 'jsonwebtoken';

// Function to generate access token
export const generateAccessToken = (userId: string, role: string, username: string, email: string): string => {
    return jwt.sign({
        id: userId,
        role,
        email,
        username
    }, process.env.JWT_SECRET as string, {
        expiresIn: '15m',
    });
};

// Function to generate refresh token
export const generateRefreshToken = (userId: string): string => { 
    return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
        expiresIn: '7d',
    });
};

// Function to verify access token
export const verifyAccessToken = (token: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};

// Function to verify refresh token
export const verifyRefreshToken = (token: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};