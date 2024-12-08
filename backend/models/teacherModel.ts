// backend/models/teacherModel.ts
import { sql, eq, and } from 'drizzle-orm';
import { db } from '../config/dbConfig';
import { teacherTable, usersTable, rolesTable } from '../db/tables';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { z } from 'zod';
import { teacherRegistrationSchema, teacherProfileUpdateSchema } from '../validators/teacherValidators';
import { teacherIdGenerator } from '../utils/generateId';
import jwt from 'jsonwebtoken';

export interface Teacher {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username?: string;
    phoneNumber?: string;
    image?: string;
    department?: string;
    qualification?: string;
    dateOfJoining?: Date;
    workExperience?: number;
    previousWork?: string;
    previousWorkAddress?: string;
    previousWorkPhoneNumber?: string;
    workShift?: string;
    workLocation?: string;
    salary?: number;
    subject?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitterUrl?: string;
    resume?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Create Teacher
export const createTeacher = async (omitTeacherData: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Validate input
    const validatedData = teacherRegistrationSchema.parse(omitTeacherData); // Use omitStudentData instead of teacherData

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Find teacher role
    const roleQuery = await db.select().from(rolesTable).where(eq(rolesTable.role_name, 'teacher')).limit(1);
    if (roleQuery.length === 0) {
        throw new Error('Teacher role not found in roles table');
    }

    const username = teacherIdGenerator();
    const roleId = roleQuery[0].id; // Corrected to access the first element

    // Prepare new user data
    const newUser = {
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        email: validatedData.email,
        username: username,
        image: validatedData.image,
        password: hashedPassword,
        role_id: roleId,
    };

    // Transaction to create teacher
    return await db.transaction(async (trx: any) => {
        // Insert user in users table
        const userResult = await trx.insert(usersTable).values(newUser).returning();
        
        // Insert teacher in teacher table
        const teacherResult = await trx.insert(teacherTable).values({
            ...newUser,
            first_name: validatedData.firstName, // Correctly map firstName to first_name
            userId: userResult[0].id
        }).returning();

        return { 
            user: userResult[0], 
            teacher: teacherResult[0] 
        };
    });
};

// Login Teacher
export const loginTeacher = async (username: string, password: string) => {
    // Find teacher by username
    const [user] = await db.select({
        id: usersTable.id,
        username: usersTable.username,
        password: usersTable.password,
        role: usersTable.role_id
    })
    .from(usersTable)
    .where(eq(usersTable.username, username));

    // Validate user and password
    if (!user || user.role !== 2) {
        throw new Error('Invalid credentials');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
        { 
            id: user.id, 
            username: user.username, 
            role: user.role 
        }, 
        process.env.JWT_SECRET as string, 
        { expiresIn: '1d' }
    );

    return { 
        token, 
        teacher: { 
            id: user.id, 
            username: user.username 
        } 
    };
};

// Generate Password Reset Token
export const generatePasswordResetToken = async (emailAddress: string) => {
    // Find user by email
    const [user] = await db.select({
        id: usersTable.id,
        email: usersTable.email,
        role: usersTable.role_id
    })
    .from(usersTable)
    .where(eq(usersTable.email, emailAddress));


    if (!user || user.role !== 2) {
        throw new Error('User not found or not authorized');
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Update user with reset token and expiry
    await db.update(usersTable)
        .set({
            resetPasswordToken: resetToken,
            resetPasswordExpires: resetTokenExpiry
        })
        .where(eq(usersTable.id, user.id));

    return resetToken;
};

// Reset Password
export const resetPassword = async (resetToken: string, newPassword: string) => {
    // Find user by reset token and check if token is still valid
    const [user] = await db.select({
        id: usersTable.id,
        resetTokenExpires: usersTable.resetPasswordExpires,
        role: usersTable.role_id
    })
    .from(usersTable)
    .where(eq(usersTable.resetPasswordToken, resetToken));

    // Validate reset token
    if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
        throw new Error('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and clear reset token
    await db.update(usersTable)
        .set({
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null,
            updated_at: new Date()
        })
        .where(eq(usersTable.id, user.id));

    return { message: 'Password reset successfully' };
};

// List Teachers
export const listTeachers = async (page: number = 1, limit: number = 10, filters: Record<string, any> = {}) => {
    const offset = (page - 1) * limit;

    // Define allowed filter columns
    const allowedFilterColumns = ['gender', 'workShift', 'subject', 'workLocation'];

    // Build dynamic filter conditions
    const filterConditions = Object.entries(filters)
        .filter(([key]) => allowedFilterColumns.includes(key))
        .map(([key, value]) => {
            const column = teacherTable[key as keyof typeof teacherTable];
            return column ? sql`${column} = ${value}` : undefined;
        })
        .filter(Boolean);

    // Fetch teachers with pagination and optional filters
    const teacherList = await db.select({
        id: teacherTable.id,
        username: teacherTable.username,
        firstName: teacherTable.firstName,
        lastName: teacherTable.lastName,
        email: teacherTable.emailAddress,
        gender: teacherTable.gender,
        subject: teacherTable.subject,
        workShift: teacherTable.workShift,
        workLocation: teacherTable.workLocation,
        image: teacherTable.image
    })
    .from(teacherTable)
    .where(filterConditions.length > 0 ? sql`${sql.join(filterConditions, ' AND ')}` : undefined)
    .limit(limit)
    .offset(offset);

    // Count total teachers for pagination
    const [{ total }] = await db.select({ 
        total: sql<number>`count(*)` 
    })
    .from(teacherTable)
    .where(filterConditions.length > 0 ? sql`${sql.join(filterConditions, ' AND ')}` : undefined);

    return {
        teachers: teacherList,
        total: Number(total)
    };
};

// Get Teacher Profile
export const getTeacherProfile = async (username: string) => {
    try {
        // Fetch user and teacher details
        const result = await db
            .select({
                id: usersTable.id,
                username: usersTable.username,
                email: usersTable.email,
                firstName: usersTable.first_name,
                lastName: usersTable.last_name,
                image: usersTable.image,
                phoneNumber: teacherTable.phoneNumber,
                department: teacherTable.subject,
                qualification: teacherTable.workExperience
            })
            .from(usersTable)
            .leftJoin(teacherTable, eq(usersTable.id, teacherTable.id))
            .where(eq(usersTable.username, username))
            .limit(1);

        if (result.length === 0) {
            throw new Error('Teacher profile not found');
        }

        return result[0];
    } catch (error) {
        console.error('❌ Error retrieving teacher profile:', error);
        throw error;
    }
};

// Get Teacher by ID
export const getTeacherById = async (teacherId: string | number) => {
    // Convert teacherId to number if it's a string
    const numericTeacherId = typeof teacherId === 'string' ? parseInt(teacherId, 10) : teacherId;

    const result = await db.select({
        id: teacherTable.id,
        username: teacherTable.username,
        firstName: teacherTable.firstName,
        lastName: teacherTable.lastName,
        email: teacherTable.emailAddress,
        phone: teacherTable.phoneNumber,
        address: teacherTable.address,
        dateOfBirth: teacherTable.dateOfBirth,
        gender: teacherTable.gender,
        bloodGroup: teacherTable.bloodGroup,
        maritalStatus: teacherTable.maritalStatus,
        workShift: teacherTable.workShift,
        workLocation: teacherTable.workLocation,
        workExperience: teacherTable.workExperience,
        subject: teacherTable.subject,
        image: teacherTable.image,
        salary: teacherTable.salary,
        dateOfJoining: teacherTable.dateOfJoining
    })
    .from(teacherTable)
    .where(eq(teacherTable.id, sql`${numericTeacherId}`))
    .limit(1);

    return result[0] || null;
};

// Get Teacher Profile by Email
export const getTeacherProfileByEmail = async (email: string) => {
    const [profile] = await db.select({
        id: teacherTable.id,
        username: teacherTable.username,
        firstName: teacherTable.firstName,
        lastName: teacherTable.lastName,
        email: teacherTable.emailAddress,
        phoneNumber: teacherTable.phoneNumber,
        image: teacherTable.image,
        department: teacherTable.subject,
        qualification: teacherTable.qualification,
        dateOfJoining: teacherTable.dateOfJoining,
        workExperience: teacherTable.workExperience,
        previousWork: teacherTable.previousWork,
        previousWorkAddress: teacherTable.previousWorkAddress,
        previousWorkPhoneNumber: teacherTable.previousWorkPhoneNumber,
        workShift: teacherTable.workShift,
        workLocation: teacherTable.workLocation,
        salary: teacherTable.salary,
        subject: teacherTable.subject,
        facebook: teacherTable.facebook,
        instagram: teacherTable.instagram,
        linkedin: teacherTable.linkedin,
        twitterUrl: teacherTable.twitterUrl,
        resume: teacherTable.resume,
        isActive: teacherTable.isActive,
        createdAt: teacherTable.createdAt,
        updatedAt: teacherTable.updatedAt
    })
    .from(teacherTable)
    .where(eq(teacherTable.emailAddress, email));

    if (!profile) {
        return null;
    }

    return profile;
};

// Update Teacher Profile
export const updateTeacherProfile = async (teacherId: string | number, data: z.infer<typeof teacherProfileUpdateSchema>) => {
    // Convert teacherId to number if it's a string
    const numericTeacherId = typeof teacherId === 'string' ? parseInt(teacherId, 10) : teacherId;

    // Validate input
    const validatedData = teacherProfileUpdateSchema.parse(data);

    // Prepare update data with type conversions
    const updateData: Record<string, any> = { 
        ...validatedData, 
        updatedAt: new Date() 
    };
    
    // Convert date fields to SQL date if they exist
    if (validatedData.dateOfBirth) {
        updateData.dateOfBirth = sql`${validatedData.dateOfBirth}::date`;
    }

    // Update teacher profile
    const updatedTeacher = await db.update(teacherTable)
        .set(updateData)
        .where(eq(teacherTable.id, sql`${numericTeacherId}`))
        .returning({
            id: teacherTable.id,
            username: teacherTable.username,
            firstName: teacherTable.firstName,
            lastName: teacherTable.lastName,
            email: teacherTable.emailAddress,
            phone: teacherTable.phoneNumber,
            address: teacherTable.address,
            dateOfBirth: teacherTable.dateOfBirth,
            gender: teacherTable.gender,
            bloodGroup: teacherTable.bloodGroup,
            maritalStatus: teacherTable.maritalStatus,
            workShift: teacherTable.workShift,
            workLocation: teacherTable.workLocation,
            workExperience: teacherTable.workExperience,
            subject: teacherTable.subject,
            image: teacherTable.image,
            salary: teacherTable.salary,
            dateOfJoining: teacherTable.dateOfJoining
        });

    return updatedTeacher[0] || null;
};

// Soft Delete Teacher
export const deleteTeacher = async (teacherId: string | number) => {
    // Convert teacherId to number if it's a string
    const numericTeacherId = typeof teacherId === 'string' ? parseInt(teacherId, 10) : teacherId;

    await db.update(teacherTable)
        .set({
            isActive: false,
            updatedAt: new Date()
        })
        .where(eq(teacherTable.id, sql`${numericTeacherId}`));
};
