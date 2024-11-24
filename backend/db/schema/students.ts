// backend/db/schema/students.ts

import { pgTable, serial, text, varchar, integer, timestamp, date } from 'drizzle-orm/pg-core';
import { users } from './users';
import { bloodType } from '../enums';

export const students = pgTable('students', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    fullName: text('full_name').notNull(),
    imageUrl: varchar('image_url', { length: 255 }).notNull(),
    previousGradeCertificate: varchar('previous_grade_certificate', { length: 255 }).notNull(),
    birthdate: date('birthdate').notNull(),
    bloodType: bloodType('blood_type').notNull(),
    gradeAppliedFor: integer('grade_applied_for').notNull(),
    
    // Address components
    city: text('city').notNull(),
    subCity: text('sub_city').notNull(),
    woreda: text('woreda').notNull(),
    houseNumber: varchar('house_number', { length: 50 }),

    nationality: text('nationality').notNull(),
    
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
