// backend/server.ts

import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import setupSwagger from './configs/swagger.config';
import { checkConnection } from './configs/db.config';
import { sessionMiddleware } from './middleware/session.middleware';
import { csrfProtection } from './middleware/csrf.middleware';


dotenv.config();

const app = express();

// Middleware configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(cookieParser());
app.use(sessionMiddleware);
app.use(csrfProtection);
app.use(helmet());
app.use(express.json());

// Setup Swagger documentation
setupSwagger(app);

// Define routes
app.get('/', (req: Request, res: Response) => {
    res.json({ message: '👋 Hello from SchoolHub! 🎓' });
});

app.get('/token', (req: Request, res: Response) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('❌ Error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`🚀 SchoolHub backend is running on http://localhost:${port} 🖥️`);
    checkConnection();
});