// backend/server.ts
import express, { Request, Response } from 'express';
import { checkConnection } from './config/dbConfig';
import dotenv from 'dotenv';
import  setupSwagger  from './config/swaggerConfig';
import authRoutes from './routes/authRoutes'; 

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());


setupSwagger(app);

app.get('/', (req: Request, res: Response) => {
    res.json({
        message: '👋 Hello from SchoolHub! 🎓'
   });
});

app.use('/api/auth', authRoutes)

app.listen(port, () => {
    console.log(`🚀 SchoolHub backend is running on  http://localhost:${port} 🖥️`);
    checkConnection()
});