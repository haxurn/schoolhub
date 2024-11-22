// backend/db/schema/admin.ts

import { pgTable, text } from 'drizzle-orm/pg-core';

export const admin = pgTable("admin", {
    username: text("username").primaryKey(),
    password: text("password").notNull(),
});