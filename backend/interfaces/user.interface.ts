// backend/interfaces/user.interface.ts

export interface User {
    id: string; // Unique identifier for the user
    email: string; // User's email address (unique)
    username: string; // User's username (unique)
    password: string; // Hashed password
    firstName?: string; // User's first name (optional)
    lastName?: string; // User's last name (optional)
    phone?: string | null; // Optional phone number (can be null)
    createdAt: Date; // Timestamp when the user was created
    updatedAt: Date; // Timestamp when the user was last updated
    roleId: string; // Foreign key linking to the user's role
    // Add other fields as necessary
    role?: UserRole; // Optional role information
}

export interface UserRole {
    id: string; // Unique identifier for the role
    name: string; // Name of the role (e.g., "admin", "student", "teacher")
    createdAt: Date; // Timestamp when the role was created
    updatedAt: Date; // Timestamp when the role was last updated
}

// Optional: If you want to include a response interface for user data
export interface UserResponse {
    id: string; // Unique identifier for the user
    email: string; // User's email address
    username: string; // User's username
    role: UserRole; // User's role information
    createdAt: Date; // Timestamp when the user was created
    updatedAt: Date; // Timestamp when the user was last updated
}