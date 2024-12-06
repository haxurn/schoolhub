// backend/config/tables.ts

import { pgTable, serial, text, varchar, integer, date, pgEnum, timestamp, time } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm/sql';
import createRoleEnum from '../enums/roleEnum';
import createBloodGroupEnum from '../enums/bloodGroupEnum';
import createGenderEnum from '../enums/genderEnum';
import createMaritalStatusEnum from '../enums/maritalStatusEnum';
import createContractTypeEnum from '../enums/contractTypeEnum';
import createWorkShiftEnum from '../enums/workShiftEnum';

const initializeEnums = async () => {
    await createRoleEnum();
    await createBloodGroupEnum();
    await createGenderEnum();
    await createMaritalStatusEnum();
    await createContractTypeEnum();
    await createWorkShiftEnum();
};

initializeEnums().catch(console.error);

const bloodGroupEnum = pgEnum('blood_group', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);
const genderEnum = pgEnum('gender', ['Male', 'Female', 'Other']);
const maritalStatusEnum = pgEnum('marital_status', ['Single', 'Married', 'Divorced', 'Widowed']);
const contractTypeEnum = pgEnum('contract_type', ['Permanent', 'Temporary']);
const workShiftEnum = pgEnum('work_shift', ['Morning', 'Afternoon', 'Both']);
const classEnum = pgEnum('class', ['k-1', 'k-2', 'k-3','1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
const religionStatusEnum = pgEnum('religion_status', ['Christian', 'Muslim', 'Other']);
const medicalConditionEnum = pgEnum('medical_condition', ['Good', 'Bad', 'Others']);
const siblingEnum = pgEnum('sibling', ['Yes', 'No']);
const guardianTypeEnum = pgEnum('guardian_type', ['Parents', 'Guardian', 'Others']);





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



export const financeTable = pgTable('finance', {
    id: serial('id').primaryKey(),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    registrarId: varchar('registrar_id', { length: 8 }).notNull().unique(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    primaryContactNumber: varchar('primary_contact_number', { length: 20 }).notNull().unique(),
    emailAddress: varchar('email_address', { length: 255 }).notNull().unique(),
    bloodGroup: bloodGroupEnum('blood_group').notNull(),
    gender: genderEnum('gender').notNull(),
    image: varchar('image', { length: 255 }).notNull(), 
    dateOfJoining: date('date_of_joining').notNull(),
    fathersName: varchar('fathers_name', { length: 100 }).notNull(),
    mothersName: varchar('mothers_name', { length: 100 }).notNull(),
    dateOfBirth: date('date_of_birth').notNull(),
    maritalStatus: maritalStatusEnum('marital_status').notNull(),
    languagesKnown: text('languages_known').notNull(),
    qualification: varchar('qualification', { length: 255 }).notNull(),
    workExperience: integer('work_experience').notNull(),
    previousWork: varchar('previous_work', { length: 255 }),
    previousWorkAddress: varchar('previous_work_address', { length: 255 }),
    previousWorkPhoneNumber: varchar('previous_work_phone_number', { length: 20 }),
    address: varchar('address', { length: 255 }).notNull(),
    permanentAddress: varchar('permanent_address', { length: 255 }).notNull(),
    panNumber: varchar('pan_number', { length: 20 }).notNull(),
    epfNumber: varchar('epf_number', { length: 20 }).notNull(),
    basicSalary: integer('basic_salary').notNull(),
    contractType: contractTypeEnum('contract_type').notNull(),
    workShift: workShiftEnum('work_shift').notNull(),
    workLocation: varchar('work_location', { length: 255 }).notNull(),
    dateOfLeaving: date('date_of_leaving'),
    medicalLeaves: integer('medical_leaves').notNull(),
    casualLeaves: integer('casual_leaves').notNull(),
    maternityLeaves: integer('maternity_leaves').notNull(),
    sickLeaves: integer('sick_leaves').notNull(),
    accountName: varchar('account_name', { length: 100 }).notNull(),
    accountNumber: varchar('account_number', { length: 20 }).notNull(),
    bankName: varchar('bank_name', { length: 100 }).notNull(),
    ifscCode: varchar('ifsc_code', { length: 20 }).notNull(),
    facebook: varchar('facebook', { length: 255 }),
    instagram: varchar('instagram', { length: 255 }),
    linkedin: varchar('linkedin', { length: 255 }),
    youtube: varchar('youtube', { length: 255 }),
    twitterUrl: varchar('twitter_url', { length: 255 }),
    resume: varchar('resume', { length: 255 }), 
    joiningLetter: varchar('joining_letter', { length: 255 }), 
    personalDocs: varchar('personal_docs', { length: 255 }), 
    password: varchar('password', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdateFn(() => sql`CURRENT_TIMESTAMP`), 
});

export const studentTable = pgTable('student', {
    id: serial('id').primaryKey(),
    firstName: varchar('first_name', { length: 100}).notNull(),
    admissionNumber: varchar('admission_number', { length: 8}).notNull().unique(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    admissionDate: date('admission_date').notNull(),
    rollNumber: varchar('roll_number', { length: 50}),
    class: classEnum('class').notNull(),
    section: varchar('section', { length: 50}),
    gender: genderEnum('gender').notNull(),
    religionStatus: religionStatusEnum('religion_status').notNull(),
    emailAddress: varchar('email_address', { length: 255 }),
    motherTongue: varchar('mother_tongue', { length: 255 }).notNull(),
    languagesKnown: text('languages_known').notNull(),
    dateOfBirth: date('date_of_birth').notNull(),
    image: varchar('image', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    bloodGroup: bloodGroupEnum('blood_group').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
    
})

export const documentTable = pgTable('document', {
    id: serial('id').primaryKey(),
    studentId: integer('student_id').references(() => studentTable.id).notNull(),
    documentType: varchar('document_type', { length: 100 }).notNull(),
    document: varchar('document', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
})

export const medicalHistoryTable = pgTable('medical_history', {
    id: serial('id').primaryKey(),
    studentId: integer('student_id').references(() => studentTable.id).notNull(),
    allergies: text('allergies'),
    medicalCondition: medicalConditionEnum('medical_condition'),
    medications: text('medications'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
})

export const previousSchoolTable = pgTable('previous_school', {
    id: serial('id').primaryKey(),
    studentId: integer('student_id').references(() => studentTable.id).notNull(),
    schoolName: varchar('school_name', { length: 255 }).notNull(),
    address: varchar('address', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});

export const siblingsTable = pgTable('siblings', {
    id: serial('id').primaryKey(),
    studentId: integer('student_id').references(() => studentTable.id).notNull(),
    isSiblingStudyingInSameSchool: siblingEnum('sibling').notNull(),
    siblingName: varchar('sibling_name', { length: 255 }).notNull(),
    siblingRollNo: varchar('sibling_roll_no', { length: 100 }).notNull(),
    siblingAdmissionNo: varchar('sibling_admission_no', { length: 100 }).notNull(),
    siblingClass: varchar('sibling_class', { length: 100 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});

export const parentsTable = pgTable('parents', {
    id: serial('id').primaryKey(),
    studentId: integer('student_id').references(() => studentTable.id).notNull(),

    fatherName: varchar('father_name', { length: 255 }).notNull(),
    fatherEmail: varchar('father_email', { length: 255 }).notNull(),
    fatherPhone: varchar('father_phone', { length: 20 }).notNull(),
    fatherOccupation: varchar('father_occupation', { length: 255 }).notNull(),
    fatherUpload: varchar('father_upload', { length: 255 }),  

    motherName: varchar('mother_name', { length: 255 }).notNull(),
    motherEmail: varchar('mother_email', { length: 255 }).notNull(),
    motherPhone: varchar('mother_phone', { length: 20 }).notNull(),
    motherOccupation: varchar('mother_occupation', { length: 255 }).notNull(),
    motherUpload: varchar('mother_upload', { length: 255 }),  
    password: varchar('password', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});

export const guardiansTable = pgTable('guardians', {
    id: serial('id').primaryKey(),
    studentId: integer('student_id').references(() => studentTable.id).notNull(),

    // Guardian Info
    guardianType: guardianTypeEnum('guardian_type').notNull(),
    guardianName: varchar('guardian_name', { length: 255 }).notNull(),
    guardianRelation: varchar('guardian_relation', { length: 255 }).notNull(),
    guardianPhone: varchar('guardian_phone', { length: 20 }).notNull(),
    guardianEmail: varchar('guardian_email', { length: 255 }).notNull(),
    guardianOccupation: varchar('guardian_occupation', { length: 255 }).notNull(),
    guardianAddress: varchar('guardian_address', { length: 255 }).notNull(),
    guardianUpload: varchar('guardian_upload', { length: 255 }),  

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});



export const teacherTable = pgTable('teacher', {
    id: serial('id').primaryKey(),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    emailAddress: varchar('email_address', { length: 255 }).notNull().unique(),
    phoneNumber: varchar('phone_number', { length: 20 }).notNull().unique(),
    dateOfBirth: date('date_of_birth').notNull(),
    gender: genderEnum('gender').notNull(),
    bloodGroup: bloodGroupEnum('blood_group').notNull(),
    address: varchar('address', { length: 255 }).notNull(),
    maritalStatus: maritalStatusEnum('marital_status').notNull(),
    qualification: varchar('qualification', { length: 255 }).notNull(),
    dateOfJoining: date('date_of_joining').notNull(),
    workExperience: integer('work_experience').notNull(),
    previousWork: varchar('previous_work', { length: 255 }),
    previousWorkAddress: varchar('previous_work_address', { length: 255 }),
    previousWorkPhoneNumber: varchar('previous_work_phone_number', { length: 20 }),
    workShift: workShiftEnum('work_shift').notNull(),
    workLocation: varchar('work_location', { length: 255 }).notNull(),
    salary: integer('salary').notNull(),
    subject: varchar('subject', { length: 255 }).notNull(),
    facebook: varchar('facebook', { length: 255 }),
    instagram: varchar('instagram', { length: 255 }),
    linkedin: varchar('linkedin', { length: 255 }),
    twitterUrl: varchar('twitter_url', { length: 255 }),
    resume: varchar('resume', { length: 255 }),
    image: varchar('image', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});

export const libraryManagerTable = pgTable('library', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 255 }).unique().notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    image: varchar('image', { length: 255 }).notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});



export const reportTable = pgTable('report', {
    id: serial('id').primaryKey(), 
    userId: integer('user_id').references(() => usersTable.id).notNull(),
    content: text('content'), 
    attachment: varchar('attachment', { length: 255 }), 
    createdAt: timestamp('created_at').defaultNow().notNull(), 
    updatedAt: timestamp('updated_at').defaultNow().notNull(), 
});


export const subjectTable = pgTable('subject', {
    id: serial('id').primaryKey(), 
    name: varchar('name', { length: 100 }).notNull(), 
    code: varchar('code', { length: 20 }).unique().notNull(), 
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(), 
    updatedAt: timestamp('updated_at').defaultNow().notNull(), 
});



export const libraryTable = pgTable('library', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(), 
    author: varchar('author', { length: 255 }).notNull(), 
    isbn: varchar('isbn', { length: 20 }).unique().notNull(),
    category: varchar('category', { length: 100 }).notNull(), 
    totalCopies: integer('total_copies').notNull(), 
    availableCopies: integer('available_copies').notNull(), 
    publishedDate: date('published_date'), 
    shelfLocation: varchar('shelf_location', { length: 50 }).notNull(), 
    subjectId: integer('subject_id').references(() => subjectTable.id).notNull(), 
    createdAt: timestamp('created_at').defaultNow().notNull(), 
    updatedAt: timestamp('updated_at').defaultNow().notNull(), 
});


export const userLibraryUsageTable = pgTable('user_library_usage', {
    id: serial('id').primaryKey(), 
    userId: integer('user_id').references(() => usersTable.id).notNull(), 
    libraryId: integer('library_id').references(() => libraryTable.id).notNull(), 
    borrowDate: timestamp('borrow_date').defaultNow().notNull(), 
    returnDate: timestamp('return_date'), // Define 'return_date'
    status: varchar('status', { length: 50 }).default('borrowed').notNull(), 
    createdAt: timestamp('created_at').defaultNow().notNull(), 
    updatedAt: timestamp('updated_at').defaultNow().notNull(), 
});



export const sectionTable = pgTable('section', {
    id: serial('id').primaryKey(), 
    sectionName: varchar('section_name', { length: 50 }).notNull(), 
    sectionCode: varchar('section_code', { length: 100 }).unique().notNull(), 
    status: varchar('status', { length: 50 }).default('active').notNull(), 
    createdAt: timestamp('created_at').defaultNow().notNull(), 
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const classTable = pgTable('class', {
    id: serial('id').primaryKey(), 
    className: varchar('class_name', { length: 100 }).notNull(), 
    classCode: varchar('class_code', { length: 100 }).unique().notNull(), 
    teacherId: integer('teacher_id').references(() => teacherTable.id).notNull(),
    studentCount: integer('student_count').default(0).notNull(),
    status: varchar('status', { length: 50 }).default('active').notNull(), 
    sectionId: integer('section_id').references(() => sectionTable.id).notNull(), 
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});


export const classRoutineTable = pgTable('class_routine', {
    id: serial('id').primaryKey(), 
    classId: integer('class_id').references(() => classTable.id),
    sectionId: integer('section_id').references(() => sectionTable.id).notNull(),
    subjectId: integer('subject_id').references(() => subjectTable.id).notNull(), 
    teacherId: integer('teacher_id').references(() => teacherTable.id).notNull(),
    dayOfWeek: varchar('day_of_week', { length: 20 }).notNull(), 
    startTime: time('start_time').notNull(), 
    endTime: time('end_time').notNull(), 
    status: varchar('status', { length: 50 }).default('scheduled').notNull(), 
    createdAt: timestamp('created_at').defaultNow().notNull(), 
    updatedAt: timestamp('updated_at').defaultNow().notNull(), 
});



export const timetableTable = pgTable('timetable', {
    id: serial('id').primaryKey(),
    classId: integer('class_id').references(() => classTable.id).notNull(), 
    sectionId: integer('section_id').references(() => sectionTable.id).notNull(), 
    subjectId: integer('subject_id').references(() => subjectTable.id).notNull(), 
    teacherId: integer('teacher_id').references(() => teacherTable.id), 
    dayOfWeek: varchar('day_of_week', { length: 20 }).notNull(), 
    startTime: time('start_time').notNull(), 
    endTime: time('end_time').notNull(), 
    createdAt: timestamp('created_at').defaultNow().notNull(), 
    updatedAt: timestamp('updated_at').defaultNow().notNull(), 
});



export const homeworkTable = pgTable('homework', {
    id: serial('id').primaryKey(),
    classId: integer('class_id').references(() => classTable.id).notNull(), 
    sectionId: integer('section_id').references(() => sectionTable.id).notNull(), 
    subjectId: integer('subject_id').references(() => subjectTable.id).notNull(), 
    teacherId: integer('teacher_id').references(() => teacherTable.id), 
    title: varchar('title', { length: 255 }).notNull(), 
    description: text('description').notNull(), 
    dueDate: date('due_date').notNull(), 
    attachment: varchar('attachment', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow().notNull(), 
    updatedAt: timestamp('updated_at').defaultNow().notNull(), 
});


export const attendanceTable = pgTable('attendance', {
    id: serial('id').primaryKey(), 
    userId: integer('user_id').references(() => usersTable.id).notNull(), 
    classId: integer('class_id').references(() => classTable.id).notNull(), 
    attendanceDate: date('attendance_date').notNull(), 
    status: varchar('status', { length: 50 }).default('present').notNull(), 
    comments: text('comments'), 
    createdAt: timestamp('created_at').defaultNow().notNull(), 
    updatedAt: timestamp('updated_at').defaultNow().notNull(), 
});



export const examinationTable = pgTable('examination', {
    id: serial('id').primaryKey(), 
    title: varchar('title', { length: 255 }).notNull(), 
    description: text('description'), 
    startDate: date('start_date').notNull(), 
    endDate: date('end_date').notNull(), 
    classId: integer('class_id').references(() => classTable.id).notNull(), 
    sectionId: integer('section_id').references(() => sectionTable.id).notNull(), 
    subjectId: integer('subject_id').references(() => subjectTable.id).notNull(), 
    maxMarks: integer('max_marks').notNull(),
    duration: time('duration').notNull(), 
    createdAt: timestamp('created_at').defaultNow().notNull(), 
    updatedAt: timestamp('updated_at').defaultNow().notNull(), 
});

export const studentTable = pgTable('student', {
    id: serial('id').primaryKey(),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    admissionNumber: varchar('admission_number', { length: 8}).notNull().unique(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    bloodGroup: bloodGroupEnum('blood_group').notNull(),
    gender: genderEnum('gender').notNull(),
    image: varchar('image', { length: 255 }),
    admissionDate: date('admission_date').notNull(),
    

    

})
