// backend/services/session.service.ts

import { prisma } from '../configs/db.config';
import { UserSession, SessionLog, SessionTimeout } from '../interfaces/session.interface';
import { generateAccessToken, generateRefreshToken } from '../utils/token.util'; // Import token utilities

export class SessionService {
    // Create a new user session
    async createSession(userId: string, role: string, username: string, email: string): Promise<UserSession> {
        const accessToken = generateAccessToken(userId, role, username, email);
        const refreshToken = generateRefreshToken(userId);

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Access token expires in 15 minutes

        const refreshTokenExpiresAt = new Date();
        refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7); // Refresh token expires in 7 days

        return await prisma.userSession.create({
            data: {
                userId,
                accessToken,
                refreshToken,
                expiresAt,
                refreshTokenExpiresAt,
            },
        });
    }

    // Log a session action
    async logSessionAction(userId: string, action: string, sessionId?: string, ipAddress?: string, userAgent?: string): Promise<SessionLog> {
        return await prisma.sessionLog.create({
            data: {
                userId,
                action,
                sessionId,
                ipAddress,
                userAgent,
            },
        });
    }

    // Create a session timeout record
    async createSessionTimeout(sessionId: string, reason: string): Promise<SessionTimeout> {
        const expiredAt = new Date(); // Set the current time as the expiration time

        return await prisma.sessionTimeout.create({
            data: {
                sessionId,
                expiredAt,
                reason,
            },
        });
    }

    // Invalidate a session
    async invalidateSession(sessionId: string): Promise<void> {
        await prisma.userSession.update({
            where: { id: sessionId },
            data: { isActive: false },
        });
    }

    // Refresh a session
    async refreshSession(refreshToken: string): Promise<UserSession> {
        const session = await prisma.userSession.findUnique({
            where: { refreshToken },
            include: { 
                user: {
                    include: {
                        role: true,  // Include the roles in the user query
                    },
                },
            },
        });

        if (!session || !session.isActive) {
            throw new Error('Invalid or expired refresh token');
        }

        // Ensure user has a role and use it directly
        const userRole = session.user.role?.name ?? null;  // Use role.name directly, no array

        if (!userRole) {
            throw new Error('No role assigned to the user');
        }

        // Generate new tokens
        const newAccessToken = generateAccessToken(session.userId, userRole, session.user.username, session.user.email);
        const newRefreshToken = generateRefreshToken(session.userId);

        // Update the session with new tokens
        return await prisma.userSession.update({
            where: { id: session.id },
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                updatedAt: new Date(),
            },
        });
    }

    // Get session by ID
    async getSessionById(sessionId: string): Promise<UserSession | null> {
        return await prisma.userSession.findUnique({
            where: { id: sessionId },
        });
    }
}
