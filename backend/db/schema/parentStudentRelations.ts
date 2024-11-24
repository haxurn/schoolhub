// backend/db/schema/parentStudentRelations.ts

import { pgTable, serial, integer } from 'drizzle-orm/pg-core';
import { students } from './students';
import { parents } from './parents';

export const parentStudentRelations = pgTable('parent_student_relations', {
    id: serial('id').primaryKey(),
    studentId: integer('student_id').references(() => students.id).notNull(),  // Foreign key referencing students
    parentId: integer('parent_id').references(() => parents.id).notNull(),    // Foreign key referencing parents
});
