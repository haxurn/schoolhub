import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { json } from 'body-parser';
import  { router as studentRouter }  from './routes/studentRoutes';


dotenv.config();
const app = express();
app.use(express.json());


// Middleware
app.use(cors());
app.use(json());
app.use(express.static('public'));

// routes
app.use('/api/students', studentRouter);

// Default route

app.get('/', (req: Request, res: Response) => {
    res.json('Welcome to the SchoolHub API!')
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
