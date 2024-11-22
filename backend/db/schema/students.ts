import { pgTable, serial, text, varchar, integer, date, foreignKey, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';
import { bloodType } from '../enums';

export const students = pgTable('students', {
    id: serial('id').primaryKey(), 
    userId: integer('user_id').references(() => users.id).notNull(),
    fullName: text('full_name').notNull(), 
    imageUrl: varchar('image_url', { length: 255 }).notNull(), 
    previousGradeCertificate: varchar('previous_grade_certificate', { length: 255 }).notNull(), 
    age: integer('age').notNull(), 
    bloodType: bloodType('blood_type').notNull(), 
    gradeAppliedFor: integer('grade_applied_for').notNull(), 
    address: text('address').notNull(), 
});