// backend/config/tables.ts

import { pgTable, serial, text, varchar, integer } from 'drizzle-orm/pg-core';
import createRoleEnum from '../enums/roleEnum'; 

(async () => {
    await createRoleEnum();
})();

export const rolesTable = pgTable('roles', {
    id: serial('id').primaryKey(),
    role_name: varchar('role_name', { length: 100 }).notNull().unique(),
});

export const usersTable = pgTable('users', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 100 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    role_id: integer('role_id').references(() => rolesTable.id).notNull(),
});
