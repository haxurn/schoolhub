import { prisma } from "../config/dbConfig";
import { bloodGroupToPrisma } from "../enums/student.enum";

interface Student {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    dateOfBirth: Date;
    gender: "Male" | "Female";
    bloodGroup: keyof typeof bloodGroupToPrisma;
    nationality: 'Ethiopian' | 'Foreign';
    religion: 'Christian' | 'Muslim' | 'Other';
    rollNumber?: number;
    classId: string;
    section: string;
    admissionDate: Date;
    academicYear: string;
    guardianId: string;
    branchId: string;
    userId: string;
    hasSiblings: boolean;
    siblingOfId: string | null;
    status: "Active" | "Inactive" | "Suspended";
}

interface Document {
    title: string;
    type: string;
    fileUrl: string; 
    uploadedBy: string;
    studentId: string;
}

export const createStudent = async (student: Student, documents: Document[]) => {
    try {
        const createdStudent = await prisma.student.create({
            data: {
                ...student,
                bloodGroup: bloodGroupToPrisma[student.bloodGroup],
                documents: {
                    create: documents, 
                }
            },
        });
        console.log("✅  Student created successfully:", createdStudent);
        return createdStudent;
    } catch (error) {
        console.error("❌ Error creating student:", error);
        throw error;
    }
};
