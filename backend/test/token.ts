import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config({ path: '../.env' });


const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbmlzdHJhdG9yIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMzMjE5MTA2LCJleHAiOjE3MzMyMjI3MDZ9.8wghSJGSGGMJQKYt784i91Udt5R03LqBxmn4DEd1GeM';

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
