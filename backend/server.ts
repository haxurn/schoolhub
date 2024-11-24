import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { json } from 'body-parser';
import { testConnection } from './config/db'; // Import db instance and testConnection function
dotenv.config();
const app = express();
app.use(express.json());
// Middleware
app.use(json());
app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
    res.json('🚀 Welcome to the SchoolHub API!')
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    testConnection();
});