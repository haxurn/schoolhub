// backend/interfaces/login.interface.ts

export interface LoginRequest {
    identifier: string; // username or email
    password: string;
}

export interface LoginResponse {
    message: string; // Response message indicating success or failure
    token?: string; // Optional token for successful login
}