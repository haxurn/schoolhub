// backend/models/libraryModel.ts

import { db } from '../config/dbConfig';
import { libraryTable, userLibraryUsageTable, usersTable } from '../db/tables';
import { eq, and, sql, like, or } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface Library {
    id: number;
    bookTitle: string;
    author: string;
    isbn: string;
    category: string;
    totalCopies: number;
    availableCopies: number;
    image: string;
    publicationYear?: number;
    publisher?: string;
    language?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface LibraryUser {
    id: number;
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface LibraryItemSearchParams {
    title?: string;
    author?: string;
    category?: string;
    isbn?: string;
    language?: string;
    minCopies?: number;
    maxCopies?: number;
}

export const createLibraryItem = async (libraryData: Omit<Library, 'id' | 'createdAt' | 'updatedAt'>): Promise<Library> => {
    try {
        const result = await db.insert(libraryTable)
            .values({
                ...libraryData,
                image: libraryData.image || '', // Provide a default empty string if image is undefined
                createdAt: new Date(),
                updatedAt: new Date()
            })
            .returning();

        return result[0] as Library;
    } catch (error) {
        console.error('❌ Error creating library item:', error);
        throw new Error('Failed to create library item');
    }
};

export const updateLibraryItem = async (id: number, updateData: Partial<Omit<Library, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Library | null> => {
    try {
        const result = await db.update(libraryTable)
            .set({
                ...updateData,
                updatedAt: new Date()
            })
            .where(eq(libraryTable.id, id))
            .returning();

        if (result.length === 0) {
            console.warn(`⚠️ No library item found with ID: ${id}`);
            return null;
        }

        return result[0] as Library;
    } catch (error) {
        console.error(`❌ Error updating library item (${id}):`, error);
        throw new Error('Failed to update library item');
    }
};

export const deleteLibraryItem = async (id: number): Promise<boolean> => {
    try {
        const result = await db.delete(libraryTable)
            .where(eq(libraryTable.id, id))
            .execute();

        return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
        console.error(`❌ Error deleting library item (${id}):`, error);
        throw new Error('Failed to delete library item');
    }
};

export const searchLibraryItems = async (params: LibraryItemSearchParams): Promise<Library[]> => {
    try {
        const conditions = [];

        if (params.title) {
            conditions.push(like(libraryTable.bookTitle, `%${params.title}%`));
        }
        if (params.author) {
            conditions.push(like(libraryTable.author, `%${params.author}%`));
        }
        if (params.category) {
            conditions.push(eq(libraryTable.category, params.category));
        }
        if (params.isbn) {
            conditions.push(eq(libraryTable.isbn, params.isbn));
        }
        if (params.language) {
            conditions.push(eq(libraryTable.language, params.language));
        }
        if (params.minCopies !== undefined) {
            conditions.push(sql`${libraryTable.availableCopies} >= ${params.minCopies}`);
        }
        if (params.maxCopies !== undefined) {
            conditions.push(sql`${libraryTable.availableCopies} <= ${params.maxCopies}`);
        }

        const result = await db.select()
            .from(libraryTable)
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .execute();

        return result as Library[];
    } catch (error) {
        console.error('❌ Error searching library items:', error);
        throw new Error('Failed to search library items');
    }
};

export const borrowLibraryItem = async (userId: number, libraryItemId: number, dueDate: Date): Promise<boolean> => {
    try {
        // Check if book is available
        const book = await getLibraryItemById(libraryItemId);
        if (!book || book.availableCopies <= 0) {
            console.warn(`⚠️ Book not available for borrowing: ${libraryItemId}`);
            return false;
        }

        // Begin transaction
        return await db.transaction(async (tx) => {
            // Decrement available copies
            await tx.update(libraryTable)
                .set({ 
                    availableCopies: sql`${libraryTable.availableCopies} - 1`,
                    updatedAt: new Date()
                })
                .where(eq(libraryTable.id, libraryItemId));

            // Record book usage
            await tx.insert(userLibraryUsageTable)
                .values({
                    userId,
                    libraryId: libraryItemId,
                    borrowDate: new Date(),
                    dueDate,
                    status: 'borrowed'
                });

            return true;
        });
    } catch (error) {
        console.error(`❌ Error borrowing library item (${libraryItemId}):`, error);
        throw new Error('Failed to borrow library item');
    }
};

export const returnLibraryItem = async (userId: number, libraryItemId: number): Promise<boolean> => {
    try {
        // Begin transaction
        return await db.transaction(async (tx) => {
            // Find the most recent borrow record
            const borrowRecord = await tx
                .select()
                .from(userLibraryUsageTable)
                .where(
                    and(
                        eq(userLibraryUsageTable.userId, userId),
                        eq(userLibraryUsageTable.libraryId, libraryItemId),
                        eq(userLibraryUsageTable.status, 'borrowed')
                    )
                )
                .orderBy(sql`borrow_date DESC`)
                .limit(1)
                .execute();

            if (borrowRecord.length === 0) {
                console.warn(`⚠️ No active borrow record found for user ${userId} and book ${libraryItemId}`);
                return false;
            }

            // Update borrow record
            await tx.update(userLibraryUsageTable)
                .set({
                    returnDate: new Date(),
                    status: 'returned'
                })
                .where(eq(userLibraryUsageTable.id, borrowRecord[0].id));

            // Increment available copies
            await tx.update(libraryTable)
                .set({ 
                    availableCopies: sql`${libraryTable.availableCopies} + 1`,
                    updatedAt: new Date()
                })
                .where(eq(libraryTable.id, libraryItemId));

            return true;
        });
    } catch (error) {
        console.error(`❌ Error returning library item (${libraryItemId}):`, error);
        throw new Error('Failed to return library item');
    }
};

export const getLibraryItemById = async (id: number): Promise<Library | null> => {
    try {
        const result = await db.select()
            .from(libraryTable)
            .where(eq(libraryTable.id, id))
            .limit(1)
            .execute();

        if (result.length === 0) {
            console.warn(`⚠️ No library item found with ID: ${id}`);
            return null;
        }

        return result[0] as Library;
    } catch (error) {
        console.error(`❌ Error fetching library item (${id}):`, error);
        throw new Error('Failed to fetch library item');
    }
};

export const createLibraryUser = async (userData: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    image?: string;
}) => {
    try {
        // Hash the password
        const hashedPassword = await hashPassword(userData.password);

        // Create library user in users table
        const result = await db.insert(usersTable).values({
            username: userData.username,
            email: userData.email,
            password: hashedPassword,
            first_name: userData.firstName,
            last_name: userData.lastName,
            role_id: 5, // Assuming library user is a specific role
            image: userData.image || '', // Provide a default empty string if image is undefined
            created_at: new Date(),
            updated_at: new Date()
        }).returning({
            id: usersTable.id,
            username: usersTable.username,
            email: usersTable.email,
            firstName: usersTable.first_name,
            lastName: usersTable.last_name,
            image: usersTable.image
        });

        return {
            id: result[0].id,
            username: result[0].username,
            email: result[0].email,
            firstName: result[0].firstName,
            lastName: result[0].lastName,
            image: result[0].image,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    } catch (error) {
        console.error('❌ Error creating library user:', error);
        throw new Error('Failed to create library user');
    }
};

export const getLibraryUserById = async (id: number): Promise<Omit<LibraryUser, 'password'> | null> => {
    try {
        const result = await db.select({
            id: usersTable.id,
            username: usersTable.username,
            email: usersTable.email,
            firstName: usersTable.first_name,
            lastName: usersTable.last_name,
            image: usersTable.image
        })
        .from(usersTable)
        .where(eq(usersTable.id, id))
        .execute();

        if (result.length === 0) {
            return null;
        }

        return result[0] as Omit<LibraryUser, 'password'>;
    } catch (error) {
        console.error(`❌ Error retrieving library user (${id}):`, error);
        throw new Error('Failed to retrieve library user');
    }
};

export const loginLibraryManager = async (username: string, password: string): Promise<{ token: string, user: Omit<LibraryUser, 'password'> } | null> => {
    try {
        // Find user by username in usersTable
        const users = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.username, username))
            .limit(1);

        if (users.length === 0) {
            console.warn(`⚠️ Login attempt with non-existent username: ${username}`);
            return null;
        }

        const user = users[0];

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.warn(`⚠️ Invalid password attempt for username: ${username}`);
            return null;
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username,
                role: 'library' // Assuming role is determined by the role_id
            }, 
            process.env.JWT_SECRET as string, 
            { 
                expiresIn: '24h' 
            }
        );

        return { 
            token, 
            user: {
                id: user.id,
                username: user.username,
                email: user.email || '',
                firstName: user.first_name || '',
                lastName: user.last_name || '',
                image: user.image || null,
                createdAt: user.created_at || new Date(),
                updatedAt: user.updated_at || new Date()
            }
        };
    } catch (error) {
        console.error('❌ Error during library manager login:', error);
        throw new Error('Login process failed');
    }
};

export const getLibraryUserProfile = async (username: string): Promise<Omit<LibraryUser, 'password'> | null> => {
    try {
        // Fetch user profile from usersTable
        const users = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.username, username))
            .limit(1);

        if (users.length === 0) {
            console.warn(`⚠️ Profile retrieval attempt for non-existent username: ${username}`);
            return null;
        }

        const user = users[0];

        return {
            id: user.id,
            username: user.username,
            email: user.email || '',
            firstName: user.first_name || '',
            lastName: user.last_name || '',
            image: user.image || null,
            createdAt: user.created_at || new Date(),
            updatedAt: user.updated_at || new Date()
        };
    } catch (error) {
        console.error(`❌ Error retrieving library user profile for ${username}:`, error);
        throw new Error('Failed to retrieve user profile');
    }
};

const hashPassword = async (password: string): Promise<string> => {
    try {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        console.error('❌ Error hashing password:', error);
        throw new Error('Password hashing failed');
    }
};
