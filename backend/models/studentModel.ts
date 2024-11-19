// backend/models/StudentModel.ts

import { pgTable, serial, varchar, date, integer, json, uniqueIndex } from 'drizzle-orm/pg-core';

interface ParentDetail {
    fullName: string;
    phoneNumber: string;
    email: string;
    job: string;
    workplaceAddress: string;
    photo: string;
    nationality: string;
}

interface ParentInfo {
    father: ParentDetail;
    mother: ParentDetail;
}

export const students = pgTable('students', {
    id: serial('id').primaryKey(),
    fullName: varchar('full_name', { length: 100 }).notNull(),
    gender: varchar('gender', {length: 10}).notNull(),
    previousGradeCertificate: varchar('previous_grade_certificate', { length: 255 }).notNull(),
    birthdate: date('birthdate').notNull(),
    age: integer('age').notNull(),
    bloodType: varchar('blood_type', { length: 5 }).notNull(),
    applyingGrade: integer('applying_grade').notNull(),
    address: json('address').notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    confirmPassword: varchar('confirm_password', { length: 255 }).notNull(),
    parentInfo: json('parent_info').notNull(),
    nationality: varchar('nationality', { length: 255 }).notNull(),
});

export interface Student {
    id: number;
    fullName: string;
    gender: string;
    previousGradeCertificate: string;
    birthdate: Date;
    age: number;
    bloodType: string;
    applyingGrade: number;
    address: {
        houseNumber: string;
        street: string;
        subCity: string;
        zone: string;
        

    };
    password: string;
    confirmPassword: string;
    parentInfo: ParentInfo;
    nationality: string;
}