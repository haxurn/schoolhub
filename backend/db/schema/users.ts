// backend/db/schema/users.ts

import { pgTable, serial, varchar, pgEnum } from 'drizzle-orm/pg-core';
import { userRole } from '../enums';



export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    role: userRole('role').notNull(), 
});
