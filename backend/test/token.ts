import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config({ path: '../.env' });


const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbmlzdHJhdG9yIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMyOTcwMzc1LCJleHAiOjE3MzI5NzM5NzV9.hbtBS71FceIbTgU7i3A4AVYHIfmtKq6Dalg0S5XacJ0';

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
