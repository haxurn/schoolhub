import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import csrf from 'csurf';
import cookieParser from 'cookie-parser'; 
import session from 'express-session';    
import setupSwagger from './config/swaggerConfig';
import { checkConnection } from './config/dbConfig';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();


app.use(cookieParser());


app.use(
  session({
    secret: process.env.SESSION_SECRET as string,  
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
    },
  })
);


const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict',
  },
});

// Apply helmet for security headers
app.use(helmet());


app.use(express.json());


app.use(csrfProtection);


setupSwagger(app);

// Test route for verifying that the server is running
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: '👋 Hello from SchoolHub! 🎓',
  });
});

app.get('/csrf-token', (req: Request, res: Response) => {
  
  res.json({ csrfToken: req.csrfToken() });
});


app.use('/api/auth', authRoutes);


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).json({ message: 'CSRF token mismatch or missing' });
  } else {
    next(err);
  }
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 SchoolHub backend is running on http://localhost:${port} 🖥️`);
  checkConnection();
});
