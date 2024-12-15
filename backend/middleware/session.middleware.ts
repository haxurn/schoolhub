// backend/middleware/sessionMiddleware.ts

import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();

// TODO: Set secure to true in production
export const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 
    }
});
