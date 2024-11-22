import { pgTable, serial, text, varchar, integer, foreignKey } from 'drizzle-orm/pg-core'
import { users } from './users';

export const parents = pgTable('parents', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    fullName: text('full_name').notNull(),
    phoneNumber: varchar('phone_number', { length: 15}).notNull(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    job: text('job').notNull(),
    workplaceAddress: varchar('workplace_address').notNull(),
    imageUrl: varchar('image_url', { length: 255 }).notNull(),
    relationships: text('relationship_to_student').notNull(),
});