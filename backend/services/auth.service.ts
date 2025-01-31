import bcrypt from 'bcrypt';
import { prisma } from '../configs/db.config';
import { LoginRequest, LoginResponse, loginSchema } from '../schemas/auth.schema';
import { generateToken } from '../utils/token.util';
import { AppError } from '../utils/appError.util'; 
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import mg from 'nodemailer-mailgun-transport';

dotenv.config(); // Load environment variables from .env file

const getClientIp = (req: Request): string => {
    const xForwardedFor = req.headers.get('x-forwarded-for') as string | undefined;
    if (xForwardedFor) {
        // If there are multiple IPs, take the first one
        return xForwardedFor.split(',')[0];
    }
    // Fallback to req.ip if x-forwarded-for is not present
    return "Can't find IP address";
};


export const login = async (data: LoginRequest, req: any): Promise<LoginResponse> => {
    // Validate the incoming data
    const validatedData = loginSchema.parse(data);
    const { username, password } = validatedData;

    // Find the user by username
    const user = await prisma.user.findUnique({
        where: { username },
        include: { role: true }
    });

    // If user not found, throw an error
    if (!user) {
        throw new AppError('Invalid username or password', 401);
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError('Invalid username or password', 401);
    }

    // Generate a token
    const token = generateToken(user.id, user.role.name);
    const userAgent = req.headers['user-agent'];

    // Create a session
    await prisma.session.create({
        data: {
            token,
            userId: user.id,
            userAgent,
            expiresAt: new Date(Date.now() + 3600000), // Token expiration time
        },
    });

    // Return the token and user information
    return {
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email || undefined,
            name: user.name,
            image: user.image || undefined,
        },
    };
};

// Generate Password Reset Token
export const generatePasswordResetToken = async (email: string): Promise<void> => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new AppError('User not found', 404);
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour

    await prisma.passwordReset.create({
        data: {
            userId: user.id,
            token,
            expiresAt,
        },
    });

    // Send the token to the user's email
    await sendPasswordResetEmail(email, token);
};

const apiKey = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;

if (!apiKey || !domain) {
    throw new Error('MAILGUN_API_KEY and MAILGUN_DOMAIN must be defined in the environment variables.');
}

const auth = {
    auth: {
        api_key: apiKey, // Your Mailgun API key
        domain: domain, // Your Mailgun domain
    },
};

const nodemailerMailgun = nodemailer.createTransport(mg(auth));

const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {
    const resetLink = `http://192.168.8.31:3000/reset-password?token=${token}`;

    try {
        await nodemailerMailgun.sendMail({
            from: `Excited User <mailgun@${domain}>`, // Adjust the sender's email as needed
            to: email,
            subject: 'Password Reset',
            text: `Click this link to reset your password: ${resetLink}`,
        });

        console.log(`Password reset email sent to ${email}`);
    } catch (error) {
        console.error(`Error sending password reset email to ${email}:`, error);
    }
};

// Validate Password Reset Token
export const validatePasswordResetToken = async (token: string): Promise<string> => {
    const passwordReset = await prisma.passwordReset.findUnique({ where: { token } });
    if (!passwordReset || passwordReset.expiresAt < new Date()) {
        throw new AppError('Invalid or expired token', 400);
    }

    return passwordReset.userId;
};

// Reset Password
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    const userId = await validatePasswordResetToken(token);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });

    // Optionally, delete the password reset token after successful reset
    await prisma.passwordReset.delete({ where: { token } });

    console.log(`Password has been reset for user ID: ${userId}`);
};