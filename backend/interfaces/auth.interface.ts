// backend/interfaces/auth.interface.ts

export interface LoginRequest {
    identifier: string; // username or email
    password: string;
}

export interface LoginResponse {
    message: string; // Response message indicating success or failure
    accessToken?: string; // Optional token for successful login
    refreshToken?: string; // Optional token for successful login
    sessionId?: string;
}