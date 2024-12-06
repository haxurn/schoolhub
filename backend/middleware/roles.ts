// backend/middleware/roles.ts

export enum UserRole {
    ADMIN = 'admin',
    TEACHER = 'teacher',
    STUDENT = 'student',
    PARENT = 'parent',
    LIBRARY_STAFF = 'library_staff',
    FINANCE = 'finance'
}

export interface DecodedToken {
    id: string;
    role: UserRole;
    email: string;
    iat?: number;
    exp?: number;
}
