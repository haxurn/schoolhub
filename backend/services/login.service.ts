import { prisma } from '../config/db.config';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.utils'; // Assuming you already have these utilities



export const loginService = async (username: string, password: string) => {
    try {

        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }


        const accessToken = generateAccessToken({
            userId: user.id,
            username: user.username,
            role: user.role,
        });


        const refreshToken = generateRefreshToken({
            userId: user.id,
        });

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            },
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('❌ Error during login:', error.message);
            throw new Error(error.message);
        } else {
            console.error('❌ Unknown error during login:', error);
            throw new Error('Internal server error');
        }
    }
};
