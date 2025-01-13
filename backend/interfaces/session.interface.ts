// backend/interfaces/session.interface.ts

export interface UserSession {
    id: string; // Unique identifier for the session
    userId: string; // User ID, linking to the User model
    accessToken: string; // Access token for the session (JWT)
    refreshToken: string; // Refresh token for the session
    createdAt: Date; // Session creation time
    updatedAt: Date; // Last session update time
    expiresAt: Date; // Access token expiration time
    refreshTokenExpiresAt: Date; // Refresh token expiration time
    isActive: boolean; // Whether the session is still active
    lastAccessed: Date; // Last time the session was accessed
}

export interface SessionLog {
    id: string; // Unique identifier for the session log entry
    userId: string; // User ID, linking to the User model
    action: string; // Action taken (e.g., "login", "logout", "password change")
    timestamp: Date; // Time of the action
    ipAddress?: string | null;
    userAgent?: string | null;
    sessionId?: string | null;
}

export interface SessionTimeout {
    id: string; // Unique identifier for the session timeout record
    sessionId: string; // Session ID that timed out
    expiredAt: Date; // Time when the session expired
    reason: string; // Reason for session expiration (e.g., "inactivity", "timeout")
    createdAt: Date; // Timeout record creation time
}

export interface RefreshToken {
    id: string; // Unique identifier for the refresh token
    userId: string; // User ID, linking to the User model
    token: string; // The refresh token string
    createdAt: Date; // When the refresh token was created
    expiresAt: Date; // When the refresh token expires
    isActive: boolean; // Whether the refresh token is still active
}