// backend/models/studentModel.ts
import { pgTable, serial, varchar, date, integer, json, foreignKey } from 'drizzle-orm/pg-core';

// Define Parent Details structure
interface ParentDetail {
    fullName: string;
    phoneNumber: string;
    email: string;
    job: string;
    workplaceAddress: string;
    photo: string;
    nationality: string;
    password: string;
}

// Define ParentInfo structure
interface ParentInfo {
    father: ParentDetail;
    mother: ParentDetail;
}

// Define the Students table
export const students = pgTable('students', {
    id: serial('id').primaryKey(),
    studentIdNumber: varchar('student_id_number', { length: 8 }).notNull(), // Unique student ID
    fullName: varchar('full_name', { length: 100 }).notNull(),
    gender: varchar('gender', { length: 10 }).notNull(),
    previousGradeCertificate: varchar('previous_grade_certificate', { length: 255 }).notNull(),
    birthdate: date('birthdate').notNull(),
    age: integer('age').notNull(),
    bloodType: varchar('blood_type', { length: 5 }).notNull(),
    applyingGrade: integer('applying_grade').notNull(),
    address: json('address').notNull(), // Store address as JSON
    password: varchar('password', { length: 255 }).notNull(),
    parentInfo: json('parent_info').notNull(), // Store parent info as JSON
    nationality: varchar('nationality', { length: 255 }).notNull(),
});

// Define the Parents table
export const parents = pgTable('parents', {
    id: serial('id').primaryKey(),
    fullName: varchar('full_name', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phoneNumber: varchar('phone_number', { length: 20 }).notNull(),
    job: varchar('job', { length: 100 }).notNull(),
    workplaceAddress: varchar('workplace_address', { length: 255 }).notNull(),
    photo: varchar('photo', { length: 255 }).notNull(),
    nationality: varchar('nationality', { length: 100 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    studentId: integer('student_id').notNull().references(() => students.id), // Foreign key to students
});

