import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config({ path: '../.env' });


const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwIiwidXNlcm5hbWUiOiJGSU43OTc2Nzg0Iiwicm9sZSI6ImZpbmFuY2UiLCJpYXQiOjE3MzM1MzU3NDMsImV4cCI6MTczMzUzOTM0M30.xn5PNN26R9bgpUPtDUAiOLYkKgrkAF5FlERyveYZEV8';

const secretKey = process.env.JWT_SECRET;

if (!secretKey) {
    console.error('JWT_SECRET is not defined');
    process.exit(1);
}

try {
    const decoded = jwt.verify(token, secretKey);
    console.log('Token is valid:', decoded);
} catch (error) {
    console.error('Failed to authenticate token:', error);
}
