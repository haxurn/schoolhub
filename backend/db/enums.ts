import { pgEnum } from 'drizzle-orm/pg-core';

export const userRole = pgEnum('role', ['STUDENT', 'PARENT', 'TEACHER', 'REGISTRAR', 'ADMIN']);
export const bloodType = pgEnum('blood_type', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);