import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import setupSwagger from './configs/swagger.config';
import { checkConnection } from './configs/db.config';
import path from 'path';
import authRoutes from './routes/auth.route';
import roleRoutes from './routes/role.route';
import permissionRoutes from './routes/permission.route';
import auditLogRoutes from './routes/auditLog.route';
import studentRoutes from './routes/student.route';
import fs from 'fs';
import requestIp from 'request-ip';

dotenv.config();

const app = express();


// Middleware configuration
app.set('trust proxy', true);
app.use(requestIp.mw());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow credentials
}));

app.use(cookieParser());
app.use(helmet());
app.use(express.json());
setupSwagger(app);

// Routes
app.use('/api', authRoutes, roleRoutes, permissionRoutes, auditLogRoutes);
app.use('/api/students', studentRoutes);


app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.all('*', (req: Request, res: Response) => {
  const method = req.method; // Get the HTTP method
  const url = req.originalUrl; // Get the requested URL

  // Read the static 405.html file
  fs.readFile(path.join(__dirname, 'public', '405.html'), 'utf8', (err, data) => {
    if (err) {
      // If reading the file fails, send a generic error response
      return res.status(500).send('Error reading the error page.');
    }

    // Replace placeholders with actual method and URL
    const pageContent = data.replace('METHOD', method).replace('PATH', url);

    // Send the dynamic HTML content with 405 status code
    res.status(405).send(pageContent);  // Only respond once
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('🚨 Error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`🚀 SchoolHub backend is running on http://localhost:${port} 🖥️`);
    checkConnection();
});