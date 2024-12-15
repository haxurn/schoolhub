// backend/controllers/loginController.ts
import { Response, Request } from 'express';
import { prisma } from '../config/dbConfig';
import bcrypt from "bcrypt";
import { z } from 'zod';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const { JWT_SECRET, REFRESH_SECRET, REFRESH_EXPIRY, JWT_EXPIRY } = process.env;

const loginSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6).max(100),
    role: z.enum(["admin", "parent", "teacher", "student", "library", "staff"]),
});

async function login(req: Request, res: Response): Promise<Response> {
    try {
        const validatedData = loginSchema.parse(req.body);

        const { username, password } = validatedData;

        const user = await prisma.user.findUnique({
            where: { username: username },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            JWT_SECRET as string,
            { expiresIn: JWT_EXPIRY }
        );

        const refreshToken = jwt.sign(
            { userId: user.id },
            REFRESH_SECRET as string,
            { expiresIn: REFRESH_EXPIRY }
        );

        return res.status(200).json({
            accessToken,
            refreshToken,
            user: { id: user.id, username: user.username, role: user.role },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
}

export { login };
