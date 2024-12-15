// backend/server.ts

import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import setupSwagger from './config/swaggerConfig';
import { checkConnection } from './config/dbConfig';
import { sessionMiddleware } from './middleware/sessionMiddleware';
import cors from 'cors';
import path from 'path';
import { csrfProtection } from './middleware/csrfMiddleware';

dotenv.config();


const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(cookieParser());
app.use(sessionMiddleware);
app.use(csrfProtection)  // TODO: Enable Csrf
app.use(helmet());
app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

setupSwagger(app);


app.get('/', (req: Request, res: Response) => {
    res.json({
        message: '👋 Hello from SchoolHub! 🎓',
    });
});

app.get('/token', (req: Request, res: Response) => {
    res.json({
        csrfToken: req.csrfToken()
    })
})




app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('❌ Error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`🚀 SchoolHub backend is running on http://localhost:${port} 🖥️`);
    checkConnection();
});
