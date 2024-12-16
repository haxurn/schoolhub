// backend/services/student.service.ts

import { prisma } from "../config/db.config";
import { deleteFiles, deleteDocuments, deleteFileByUrl } from '../utils/document.utils';
import { Document, documentSchema, registerSchema, Student, ExamResultSchema, MedicalHistorySchema, guardianSchema, bookReviewSchema, bookReservationSchema} from '../schema/';
import { bloodGroupToPrisma } from '../enums';
import { admissionNumber } from "../utils/generator.utils";
import bcrypt from 'bcrypt';

export const createStudent = async (student: any, documents: any[]) => {
    let createdStudent;

    try {
        documentSchema.parse(documents);
        const validatedStudent = registerSchema.parse(student);

        const hashedPassword = await bcrypt.hash(validatedStudent.password, 10);

        const createUser = await prisma.users.create({
            data: {
                username: admissionNumber(), 
                password: hashedPassword,
                role: "student",
                status: validatedStudent.status,
            },
        });

        createdStudent = await prisma.student.create({
            data: {
                firstName: validatedStudent.firstName,
                lastName: validatedStudent.lastName,
                email: validatedStudent.email,
                phone: validatedStudent.phone,
                rollNumber: validatedStudent.rollNumber,
                classId: validatedStudent.classId,
                section: validatedStudent.section,
                guardianId: validatedStudent.guardianId,
                branchId: validatedStudent.branchId,
                userId: createUser.id,
                hasSiblings: validatedStudent.hasSiblings,
                siblingOfId: validatedStudent.siblingOfId,
                status: validatedStudent.status,
                bloodGroup: bloodGroupToPrisma[validatedStudent.bloodGroup as keyof typeof bloodGroupToPrisma],
                dateOfBirth: validatedStudent.dateOfBirth,
                gender: validatedStudent.gender,
                nationality: validatedStudent.nationality,
                religion: validatedStudent.religion,
                academicYear: validatedStudent.academicYear,
                documents: {
                    create: documents.map(doc => ({
                        title: doc.title,
                        type: doc.type,
                        fileUrl: doc.fileUrl,
                        description: doc.description ?? null,
                        uploadedBy: createUser.id,  
                    })),
                },
            },
        });

        console.log("✅ Student created successfully:", createdStudent);
        return createdStudent;

    } catch (error) {
        console.error("❌ Error creating student:", error instanceof Error ? error.message : error);
      
        const fileUrls = documents.map(doc => doc.fileUrl);
        await deleteFiles(fileUrls);
        
        throw error; 
    }
};

export const getStudentById = async (id: string) => {
    try {
        const student = await prisma.student.findUnique({
            where: { id },
            include: {
                documents: true,  
                guardian: true,
                branch: true,
                attendance: true,
                siblings: true,
                user: true,
                parent: true,
                previousSchools: true,
                currentClass: true,
                classMark: true,
                submissions: true,
                medicalHistory: true,
                examResult: true,
                siblingOf: true
            },
        });

        if (!student) {
            throw new Error("Student not found!");
        }

        return student;
    } catch (error) {
        console.error("❌ Error fetching student:", error);
        throw error;
    }
};

export const getAllStudents = async () => {
    try {
        const students = await prisma.student.findMany({
            include: {
                documents: true,  
                user: true,
                parent: true,
                guardian: true,
                branch: true,
            },
        });
        return students;
    } catch (error) {
        console.error("❌ Error fetching all students:", error);
        throw error;
    }
};

export const updateStudent = async (id: string, updatedData: Partial<Student>) => {
    try {
        const updatedStudent = await prisma.student.update({
            where: { id },
            data: updatedData,
        });

        return updatedStudent;
    } catch (error) {
        console.error("❌ Error updating student:", error);
        throw error;
    }
};

export const deleteStudent = async (id: string) => {
    try {
        const student = await prisma.student.findUnique({
            where: { id },
            include: { 
                documents: true,  
                guardian: true,
                branch: true,
                attendance: true,
                siblings: true,
                user: true,
                parent: true,
                previousSchools: true,
                currentClass: true,
                classMark: true,
                submissions: true,
                medicalHistory: true,
                examResult: true,
                siblingOf: true 
            },
        });

        if (!student) {
            throw new Error("Student not found");
        }

        await deleteDocuments(student.documents as Document[]);

        const deletedStudent = await prisma.student.delete({
            where: { id },
        });

        return deletedStudent;
    } catch (error) {
        console.error("❌ Error deleting student:", error);
        throw error;
    }
};

export const addDocumentToStudent = async (studentId: string, document: Document) => {
    try {
        const documentData: any = {
            title: document.title,  
            type: document.type,
            fileUrl: document.fileUrl,
            description: document.description ?? undefined,  
            student: {
                connect: { id: studentId },
            },
        };

        if (document.uploadedBy) {
            documentData.uploadedBy = document.uploadedBy;
        }

        const addedDocument = await prisma.document.create({
            data: documentData,
        });

        console.log("✅ Document added successfully:", addedDocument);
        return addedDocument;
    } catch (error) {
        console.error("❌ Error adding document:", error);
        throw error; 
    }
};

export const deleteDocumentFromStudent = async (studentId: string, documentId: string) => {
    try {
        const document = await prisma.document.findUnique({
            where: { id: documentId },
        });

        if (!document || document.studentId !== studentId) {
            throw new Error("Document not found or does not belong to the student");
        }

        await deleteFileByUrl(document.fileUrl);  

        const deletedDocument = await prisma.document.delete({
            where: { id: documentId },
        });

        return deletedDocument;
    } catch (error) {
        console.error("❌ Error deleting document from student:", error);
        throw error;
    }
};


export const getStudentsByClassAndSection = async (classId: string, section: string) => {
    try {
        const students = await prisma.student.findMany({
            where: {
                classId,
                section,
            },
            include: {
                documents: true,
                user: true,
                parent: true,
                guardian: true,
                branch: true,
            },
        });
        return students;
    } catch (error) {
        console.error("❌ Error fetching students by class and section:", error);
        throw error;
    }
};

export const searchStudents = async (searchTerm: string) => {
    try {
        const students = await prisma.student.findMany({
            where: {
                OR: [
                    {
                        firstName: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                    {
                        lastName: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                    {
                        rollNumber: parseInt(searchTerm),  
                    },  
                ],
            },
            include: {
                documents: true,
                user: true,
                parent: true,
                guardian: true,
                branch: true,
                currentClass: true
            },
        });

        return students;
    } catch (error) {
        console.error("❌ Error searching students:", error);
        throw error;
    }
};

export const addExamResult = async (studentId: string, examResult: any) => {
    try {
        const validatedExamResult = ExamResultSchema.parse({
            ...examResult,
            studentId, 
        });


        const result = await prisma.examResult.create({
            data: validatedExamResult,
        });

        return result;
    } catch (error) {
        console.error("❌ Error adding exam result:", error);
        throw error;
    }
};

export const getStudentExamResults = async (studentId: string) => {
    try {
        const results = await prisma.examResult.findMany({
            where: { studentId },
        });
        return results;
    } catch (error) {
        console.error("❌ Error fetching exam results:", error);
        throw error;
    }
};


export const getStudentAttendance = async (studentId: string) => {
    try {
        const attendance = await prisma.attendance.findMany({
            where: { studentId },
        });
        return attendance;
    } catch (error) {
        console.error("❌ Error fetching student attendance:", error);
        throw error;
    }
};

export const assignSubjectsToStudent = async (studentId: string, subjectIds: string[]) => {
    try {
        const updatedStudent = await prisma.student.update({
            where: { id: studentId },
            data: {
                subjects: {
                    connect: subjectIds.map((id) => ({ id })), 
                },
            },
            include: {
                subjects: true, 
            },
        });
        return updatedStudent;
    } catch (error) {
        console.error("❌ Error assigning subjects to student:", error);
        throw error;
    }
};

export const removeSubjectsFromStudent = async (studentId: string, subjectIds: string[]) => {
    try {
        const updatedStudent = await prisma.student.update({
            where: { id: studentId },
            data: {
                subjects: {
                    disconnect: subjectIds.map((id) => ({ id })),
                },
            },
        });
        return updatedStudent;
    } catch (error) {
        console.error("❌ Error removing subjects from student:", error);
        throw error;
    }
};

export const addMedicalHistory = async (studentId: string, medicalHistory: any) => {
    try {
        const validatedData = MedicalHistorySchema.parse({
            ...medicalHistory,
            studentId, 
        });

        const history = await prisma.medicalHistory.create({
            data: {
                studentId: validatedData.studentId,
                allergies: validatedData.allergies,
                conditions: validatedData.conditions,
                medications: validatedData.medications,
                emergencyContact: validatedData.emergencyContact,
                documents: {
                    create: validatedData.documents?.map(doc => ({
                        title: doc.title,
                        type: doc.type,
                        fileUrl: doc.fileUrl,
                        uploadedBy: doc.uploadedBy, 
                        description: doc.description ?? null,
                    })),
                },
            },
        });

        return history;
    } catch (error) {
        console.error("❌ Error adding medical history:", error);
        throw error; 
    }
};


export const getMedicalHistory = async (studentId: string) => {
    try {
        const history = await prisma.medicalHistory.findMany({
            where: { studentId },
        });
        return history;
    } catch (error) {
        console.error("❌ Error fetching medical history:", error);
        throw error; 
    }
};


export const updateGuardianInfo = async (studentId: string, guardian: any) => {
    try {
        const updatedStudent = await prisma.student.update({
            where: { id: studentId },
            data: {
                guardian: {
                    update: guardian,
                },
            },
        });
        return updatedStudent;
    } catch (error) {
        console.error("❌ Error updating guardian information:", error);
        throw error;
    }
};

export const getPreviousSchools = async (studentId: string) => {
    try {
        const previousSchools = await prisma.previousSchool.findMany({
            where: {
                students: {
                    some: {
                        id: studentId, 
                    },
                },
            },
        });
        return previousSchools;
    } catch (error) {
        console.error("❌ Error fetching previous schools:", error);
        throw error; 
    }
};



export const createBookReview = async (req: Request, res: Response) => {
    try {
        const validatedData = bookReviewSchema.parse(req.body); 

        const newBookReview = await prisma.bookReview.create({
            data: validatedData,
        });

        return newBookReview;
    } catch (error) {
        console.error("❌ Error creating book review:", error);
        throw error;
    }
};


export const createBookReservation = async (req: Request, res: Response) => {
    try {
        const validatedData = bookReservationSchema.parse(req.body); 

        const newBookReservation = await prisma.bookReservation.create({
            data: {
                status: validatedData.status, 
                studentId: validatedData.studentId,
                bookId: validatedData.bookId,
                expiresAt: validatedData.expiresAt,
                createdAt: new Date(), 
                updatedAt: new Date(), 
            },
        });

        return newBookReservation;
    } catch (error) {
        console.error("❌ Error creating book reservation:", error);
        throw error;
    }
};
