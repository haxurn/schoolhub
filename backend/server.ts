// backend/server.ts
import express, { Request, Response } from 'express';
import { checkConnection } from './config/dbConfig';
import dotenv from 'dotenv';
import setupSwagger from './config/swaggerConfig';
import authRoutes from './routes/authRoutes'; 
import helmet from 'helmet';
import csrf from 'csurf';

dotenv.config();

const app = express();


app.use(helmet());

// Set up CSRF protection
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection); // Apply CSRF protection globally (or you can apply it only to specific routes)

// Use JSON parsing middleware
app.use(express.json());

const port = process.env.PORT || 5000;

// Set up Swagger for API documentation
setupSwagger(app);

app.get('/', (req: Request, res: Response) => {
    res.json({
        message: '👋 Hello from SchoolHub! 🎓'
    });
});

// API routes
app.use('/api/auth', authRoutes);


app.get('/csrf-token', (req: Request, res: Response) => {
    // Send CSRF token to client
    res.json({ csrfToken: req.csrfToken() });
});

app.listen(port, () => {
    console.log(`🚀 SchoolHub backend is running on http://localhost:${port} 🖥️`);
    checkConnection();
});
