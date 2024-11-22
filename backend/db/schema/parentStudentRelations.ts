import { pgTable, integer } from 'drizzle-orm/pg-core';
import { parents } from './parents';
import { students } from './students';

export const parentStudentRelations = pgTable('parent_student_relations', {
    parentId: integer('parent_id').references(() => parents.id).notNull(), 
    studentId: integer('student_id').references(() => students.id).notNull(), 
});
