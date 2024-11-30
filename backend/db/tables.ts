// backend/config/tables.ts

import { pgTable, serial, text, varchar, integer, date, pgEnum } from 'drizzle-orm/pg-core';
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
    image: varchar('image', { length: 255 }), 
    dateOfJoining: date('date_of_joining').notNull(),
    fathersName: varchar('fathers_name', { length: 100 }).notNull(),
    mothersName: varchar('mothers_name', { length: 100 }).notNull(),
    dateOfBirth: date('date_of_birth').notNull(),
    maritalStatus: maritalStatusEnum('marital_status').notNull(),
    languagesKnown: text('languages_known'),
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
});
