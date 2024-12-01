// backend/middleware/sessionMiddleware.ts

import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();

export const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false, // TODO: Set to true in production
        sameSite: 'strict',
    },
});
