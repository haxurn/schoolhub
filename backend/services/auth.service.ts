// backend/services/auth.service.ts

import { prisma } from '../configs/db.config';
import bcrypt from 'bcrypt';
import { LoginRequest, LoginResponse } from '../interfaces/auth.interface';
import { SessionService } from './session.service'; // Import the session service
import { User } from '../interfaces/user.interface'; // Assuming you have a User interface
import userSchema from '../schemas/user.schema'; // Import the user schema

export class AuthService {
    private sessionService = new SessionService();

    // User login method
    async login(data: LoginRequest): Promise<LoginResponse> {
        // Validate the incoming data against the login schema
        const validationResult = userSchema.loginSchema.safeParse(data);

        if (!validationResult.success) {
            // If validation fails, throw an error with the validation messages
            throw new Error(validationResult.error.errors.map(err => err.message).join(', '));
        }

        const { identifier, password } = data;

        // Find user by email or username
        const user: User | null = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier },
                ],
            },
            include: {
                role: true,  // Include the role in the user query
            },
        });

        if (!user) {
            throw new Error('Invalid email/username or password');
        }

        // Check if the role is defined
        if (!user.role) {
            throw new Error('User  role is not defined');
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid email/username or password');
        }

        // Create a new session
        const session = await this.sessionService.createSession(user.id, user.role.id, user.username, user.email);

        return {
            message: 'Login successful',
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
            sessionId: session.id,
        };
    }
}