// backend/schema/index.ts

import { z } from "zod";

const loginSchema = z.object({
    username: z.string(),
    password: z.string()
})

const documentSchema = z.object({
    title: z.string(),
    type: z.string(),
    fileUrl: z.string(),
    description: z.string().optional(),  
    uploadedBy: z.string().optional(),   
    studentId: z.string(),
    medicalHistoryId: z.string().optional(),
    previousSchoolId: z.string().optional(),
    updatedAt: z.date().optional(),
    guardianId: z.string().optional(),
    bookId: z.string().optional(),
})

const ExamStatus = z.enum(['Passed', 'Failed', 'Incomplete', 'Absent']);


const ExamResultSchema = z.object({
    id: z.string().optional(), 
    examId: z.string().min(1, "Exam ID is required"), 
    studentId: z.string().min(1, "Student ID is required"), 
    marksObtained: z.number().min(0, "Marks obtained must be at least 0"), 
    grade: z.number().min(0, "Grade must be at least 0").max(100, "Grade must not exceed 100"), 
    status: ExamStatus, 
    createdAt: z.date().optional(), 
    updatedAt: z.date().optional(), 
});

const registerSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    rollNumber: z.number().optional(),
    classId: z.string(),
    section: z.string().optional(),
    guardianId: z.string().optional(),
    branchId: z.string(),
    userId: z.string(),
    hasSiblings: z.boolean(),
    siblingOfId: z.string().optional(),
    status: z.enum(['Active', 'Inactive', 'Suspended']),
    bloodGroup: z.enum(['A_PLUS', 'A_MINUS', 'B_PLUS', 'B_MINUS', 'O_PLUS', 'O_MINUS', 'AB_PLUS', 'AB_MINUS']),
    dateOfBirth: z.string(),  
    gender: z.enum(['Male', 'Female']),  
    nationality: z.enum(['Ethiopian', 'Foreign']), 
    religion: z.enum(['Christian', 'Muslim','Other']), 
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    academicYear: z.string(), 
});

const MedicalHistorySchema = z.object({
    id: z.string().optional(), 
    studentId: z.string().min(1, "Student ID is required").max(255, "Student ID must be less than 256 characters"), 
    allergies: z.string().optional(), 
    conditions: z.string().optional(), 
    medications: z.string().optional(), 
    emergencyContact: z.string().optional(), 
    documents: z.array(z.object({ 
        title: z.string(),
        type: z.string(),
        fileUrl: z.string().url("Invalid URL format"), 
        description: z.string().optional(),
        uploadedBy: z.string(),
    })).optional(), 
});

const addressSchema = z.object({
    id: z.string().optional(), 
    street: z.string().min(1, "Street address is required"), 
    city: z.string().min(1, "City is required"), 
    state: z.string().min(1, "State is required"), 
    country: z.string().min(1, "Country is required"), 
    zipCode: z.string().min(1, "Zip code is required"), 
    staffId: z.string().optional(), 
    branchId: z.string().optional(),
    parentId: z.string().optional(),
    teacherId: z.string().optional(), 
    guardianId: z.string().optional(), 
    createdAt: z.date().optional(), 
    updatedAt: z.date().optional(), 
});


const guardianType = z.enum([ 'LegalGuardian', 'Relative']);

const guardianSchema = z.object({
    id: z.string().optional(), 
    relation: guardianType, 
    firstName: z.string().min(1, "First name is required"), 
    lastName: z.string().min(1, "Last name is required"), 
    email: z.string().email("Invalid email format"), 
    phone: z.string().min(10, "Phone number must be at least 10 characters long"), 
    guardianAddress: z.string().min(1, "Guardian address is required"), 
    student: z.array(z.string()).optional(), 
    documents: z.array(documentSchema).optional(), 
    addresses: z.array(addressSchema).optional(), 
    createdAt: z.date().optional(), 
    updatedAt: z.date().optional(), 
});

const previousSchoolSchema = z.object({
    id: z.string().optional(), 
    name: z.string().min(1, "School name is required"), 
    address: z.string().min(1, "Address is required"), 
    board: z.string().optional(), 
    medium: z.string().optional(), 
    yearOfPassing: z.date(), 
    percentage: z.number().optional(),
    grade: z.string().optional(), 
    reasonForLeaving: z.string().optional(), 
    documents: z.array(documentSchema).optional(), 
    students: z.array(z.string()).optional(), 
    createdAt: z.date().optional(), 
    updatedAt: z.date().optional(), 
});

const bookReviewSchema = z.object({
    id: z.string().optional(), 
    bookId: z.string().min(1, "Book ID is required"), 
    studentId: z.string().min(1, "Student ID is required"), 
    rating: z.number()
        .min(0, "Rating must be at least 0")
        .max(5, "Rating cannot exceed 5"), 
    review: z.string().optional(), 
    createdAt: z.date().optional(), 
    updatedAt: z.date().optional(), 
});

const reservationStatus = z.enum([
    'Pending',
    'Fulfilled',
    'Expired',
    'Cancelled'
]); // Adjust based on your actual statuses


const bookReservationSchema = z.object({
    id: z.string().optional(), 
    bookId: z.string().min(1, "Book ID is required"), 
    studentId: z.string().min(1, "Student ID is required"), 
    status: reservationStatus.optional().default('Pending'), 
    expiresAt: z.date(), 
    createdAt: z.date().optional(), 
    updatedAt: z.date().optional(), 
});
  

type Student = z.infer<typeof registerSchema>;




export type Document = z.infer<typeof documentSchema>;
export {
    loginSchema,
    documentSchema,
    ExamResultSchema,
    Student,
    registerSchema,
    MedicalHistorySchema,
    guardianSchema,
    addressSchema,
    previousSchoolSchema,
    bookReviewSchema,
    bookReservationSchema
}


