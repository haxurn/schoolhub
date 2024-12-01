// backend/server.ts

import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import setupSwagger from './config/swaggerConfig';
import { checkConnection } from './config/dbConfig';
import authRoutes from './routes/authRoutes';
import { sessionMiddleware } from './middleware/sessionMiddleware';

dotenv.config();

const app = express();


app.use(cookieParser());


app.use(sessionMiddleware);


app.use(helmet());


app.use(express.json());



setupSwagger(app);

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: '👋 Hello from SchoolHub! 🎓',
  });
});




app.use('/api/auth', authRoutes);


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 SchoolHub backend is running on http://localhost:${port} 🖥️`);
  checkConnection();
});
