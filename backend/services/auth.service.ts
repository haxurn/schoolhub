import bcrypt from 'bcrypt';
import { prisma } from '../configs/db.config';
import { LoginRequest, LoginResponse, loginSchema } from '../schemas/auth.schema';
import { generateToken } from '../utils/token.util';
import { AppError } from '../utils/appError.util'; 

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    // Validate the incoming data
    const validatedData = loginSchema.parse(data);
    const { username, password } = validatedData;

    // Find the user by username
    const user = await prisma.user.findUnique({
        where: { username },
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
    const token = generateToken(user.id);

    // Create a session
    await prisma.session.create({
        data: {
            token,
            userId: user.id,
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