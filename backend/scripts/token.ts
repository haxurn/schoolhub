import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config({ path: '../.env' });

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImpvaG4iLCJ1c2VybmFtZSI6ImpvaG4iLCJyb2xlIjoibGlicmFyeV9zdGFmZiIsImlhdCI6MTczMzc0OTg5MywiZXhwIjoxNzMzNzUzNDkzfQ.7lx6HEIjpHDEYpNhTcFVM9QrS2dXoVt83zjjrGvUnVI'

const secretKey = process.env.JWT_SECRET || '21fad8b9afc1a2902c4d70918ad46eaf6ac4b6f71df25fc7a1983ca2384b588780749ad30f16a85b0bf8f1c503e5fb79e5b19d86dfd5c0db67dce7f12634728ce6f26bd97621b01b4da37545d79b4d85043f5d19998462bd2e82a9986999dba7b306adc62ded9feaee8c7bc305cc69137f75934130ad203abac6fbce34f9328d872445accf1ab81fdedb1c247cf59c4767f7b1fe91572df56d8ebb7e5e5a9d4ae7e95048a85d2a062ba8e58d7a2cd32884d969a62d140738ff0cd0da11d5c6f668250e6b26cd650ef8c9d475d6169f9830795dd4e96847888126e868d2ce54b37a76f57be067b56d963970d5968573e2eb3e4a632e784d3a78ffe4326ae08430';

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
