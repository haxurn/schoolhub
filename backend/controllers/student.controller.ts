import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/appError.util';
import { logAction } from '../utils/logger.util';

const prisma = new PrismaClient();

// Get all students with pagination and filtering
export const getAllStudents = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string || '';
        const grade = req.query.grade as string || '';
        const status = req.query.status as string || '';
        
        const skip = (page - 1) * limit;
        
        const where: any = {};
        
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { studentId: { contains: search, mode: 'insensitive' } }
            ];
        }
        
        if (grade) {
            where.grade = grade;
        }
        
        if (status) {
            where.status = status;
        }

        const [students, total] = await Promise.all([
            prisma.student.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            email: true,
                            createdAt: true
                        }
                    },
                    enrollments: {
                        include: {
                            course: {
                                select: {
                                    title: true,
                                    courseCode: true
                                }
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.student.count({ where })
        ]);

        const totalPages = Math.ceil(total / limit);

        logAction({
            userId: req.user?.userId,
            action: 'VIEW_STUDENTS',
            actionType: 'Read',
            details: { page, limit, total }
        });

        return res.status(200).json({
            success: true,
            data: students,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: total,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch students'
        });
    }
};

// Get student by ID
export const getStudentById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;

        const student = await prisma.student.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        email: true,
                        createdAt: true
                    }
                },
                enrollments: {
                    include: {
                        course: {
                            include: {
                                teacher: {
                                    select: {
                                        firstName: true,
                                        lastName: true
                                    }
                                }
                            }
                        }
                    }
                },
                grades: {
                    include: {
                        course: {
                            select: {
                                title: true,
                                courseCode: true
                            }
                        }
                    },
                    orderBy: { examDate: 'desc' }
                },
                attendances: {
                    include: {
                        class: {
                            include: {
                                course: {
                                    select: {
                                        title: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: { date: 'desc' },
                    take: 20
                }
            }
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        logAction({
            userId: req.user?.userId,
            action: 'VIEW_STUDENT_DETAILS',
            actionType: 'Read',
            details: { studentId: id }
        });

        return res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Error fetching student:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch student'
        });
    }
};

// Create new student
export const createStudent = async (req: Request, res: Response): Promise<Response> => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            dateOfBirth,
            address,
            grade,
            section,
            guardianName,
            guardianPhone,
            guardianEmail,
            enrollmentDate
        } = req.body;

        // Generate student ID
        const lastStudent = await prisma.student.findFirst({
            orderBy: { studentId: 'desc' }
        });
        
        let nextNumber = 1;
        if (lastStudent) {
            const lastNumber = parseInt(lastStudent.studentId.replace('STU', ''));
            nextNumber = lastNumber + 1;
        }
        
        const studentId = `STU${nextNumber.toString().padStart(3, '0')}`;

        // Create user account for student
        const user = await prisma.user.create({
            data: {
                name: `${firstName} ${lastName}`,
                username: studentId.toLowerCase(),
                email: email || `${studentId.toLowerCase()}@school.edu`,
                password: '$2b$10$defaultPasswordHash', // In real app, generate proper hash
                isEmailVerified: false,
                roleId: 'student-role-id' // You'll need to create this role first
            }
        });

        const student = await prisma.student.create({
            data: {
                userId: user.id,
                studentId,
                firstName,
                lastName,
                email,
                phone,
                dateOfBirth: new Date(dateOfBirth),
                address,
                grade,
                section,
                guardianName,
                guardianPhone,
                guardianEmail,
                enrollmentDate: enrollmentDate ? new Date(enrollmentDate) : new Date()
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        email: true
                    }
                }
            }
        });

        logAction({
            userId: req.user?.userId,
            action: 'CREATE_STUDENT',
            actionType: 'Create',
            details: { studentId: student.id, studentCode: studentId }
        });

        return res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: student
        });
    } catch (error) {
        console.error('Error creating student:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create student'
        });
    }
};

// Update student
export const updateStudent = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Check if student exists
        const existingStudent = await prisma.student.findUnique({
            where: { id }
        });

        if (!existingStudent) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Update student data
        const student = await prisma.student.update({
            where: { id },
            data: {
                ...updateData,
                dateOfBirth: updateData.dateOfBirth ? new Date(updateData.dateOfBirth) : undefined,
                enrollmentDate: updateData.enrollmentDate ? new Date(updateData.enrollmentDate) : undefined,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        email: true
                    }
                }
            }
        });

        // Update associated user if name changed
        if (updateData.firstName || updateData.lastName) {
            await prisma.user.update({
                where: { id: existingStudent.userId },
                data: {
                    name: `${updateData.firstName || existingStudent.firstName} ${updateData.lastName || existingStudent.lastName}`
                }
            });
        }

        logAction({
            userId: req.user?.userId,
            action: 'UPDATE_STUDENT',
            actionType: 'Update',
            details: { studentId: id }
        });

        return res.status(200).json({
            success: true,
            message: 'Student updated successfully',
            data: student
        });
    } catch (error) {
        console.error('Error updating student:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update student'
        });
    }
};

// Delete student
export const deleteStudent = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;

        // Check if student exists
        const existingStudent = await prisma.student.findUnique({
            where: { id }
        });

        if (!existingStudent) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Delete student (this will cascade delete the user due to foreign key constraints)
        await prisma.student.delete({
            where: { id }
        });

        logAction({
            userId: req.user?.userId,
            action: 'DELETE_STUDENT',
            actionType: 'Delete',
            details: { studentId: id, studentCode: existingStudent.studentId }
        });

        return res.status(200).json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting student:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete student'
        });
    }
};

// Get student statistics
export const getStudentStats = async (req: Request, res: Response): Promise<Response> => {
    try {
        const [
            totalStudents,
            activeStudents,
            graduatedStudents,
            thisMonthEnrollments,
            gradeDistribution
        ] = await Promise.all([
            prisma.student.count(),
            prisma.student.count({ where: { status: 'ACTIVE' } }),
            prisma.student.count({ where: { status: 'GRADUATED' } }),
            prisma.student.count({
                where: {
                    enrollmentDate: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                }
            }),
            prisma.student.groupBy({
                by: ['grade'],
                _count: true,
                orderBy: { grade: 'asc' }
            })
        ]);

        return res.status(200).json({
            success: true,
            data: {
                totalStudents,
                activeStudents,
                graduatedStudents,
                thisMonthEnrollments,
                gradeDistribution
            }
        });
    } catch (error) {
        console.error('Error fetching student stats:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch student statistics'
        });
    }
};