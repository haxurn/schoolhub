// backend/db/schema/parents.ts

import { pgTable, serial, text, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const parents = pgTable('parents', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),  
    fullName: text('full_name').notNull(),
    phoneNumber: varchar('phone_number', { length: 15 }).notNull(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    job: text('job').notNull(),
    imageUrl: varchar('image_url', { length: 255 }).notNull(),
    identityUrl: varchar('identity_url', { length: 255 }).notNull(), // For identity verification (e.g., image or document link)
    relationships: text('relationship_to_student').notNull(), 
    nationality: text('nationality').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
