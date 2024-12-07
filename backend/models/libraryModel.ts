// backend/models/libraryModel.ts

import { db } from '../config/dbConfig';
import { libraryTable } from '../db/tables';
import { eq } from 'drizzle-orm';

interface Library {
    id: number;
    title: string;
    author: string;
    isbn: string;
    category: string;
    totalCopies: number;
    availableCopies: number;
    publishedDate?: Date;
    shelfLocation: string;
    subjectId?: number;
    createdAt: Date;
    updatedAt: Date;
}

export const createLibraryItem = async (libraryData: Omit<Library, 'id' | 'createdAt' | 'updatedAt'>) => {
    const sanitizedLibraryData = {
        ...libraryData,
        subjectId: libraryData.subjectId ?? null, // Handle optional subjectId
    };

    await db.insert(libraryTable).values(sanitizedLibraryData as any).execute();
};

export const getLibraryItemById = async (id: number): Promise<Library | null> => {
    const result = await db
        .select({
            id: libraryTable.id,
            title: libraryTable.title,
            author: libraryTable.author,
            isbn: libraryTable.isbn,
            category: libraryTable.category,
            totalCopies: libraryTable.totalCopies,
            availableCopies: libraryTable.availableCopies,
            publishedDate: libraryTable.publishedDate,
            shelfLocation: libraryTable.shelfLocation,
            subjectId: libraryTable.subjectId,
            createdAt: libraryTable.createdAt,
            updatedAt: libraryTable.updatedAt,
        })
        .from(libraryTable)
        .where(eq(libraryTable.id, id))
        .limit(1)
        .execute();

    if (result.length === 0) {
        console.warn(`⚠️ No library item found with ID: ${id}`);
        return null;
    }

    const item = result[0];
    return {
        ...item,
        publishedDate: item.publishedDate ? new Date(item.publishedDate) : undefined, // Convert to Date
    } as Library;
};

export const getAllLibraryItems = async (): Promise<Library[]> => {
    const result = await db
        .select({
            id: libraryTable.id,
            title: libraryTable.title,
            author: libraryTable.author,
            isbn: libraryTable.isbn,
            category: libraryTable.category,
            totalCopies: libraryTable.totalCopies,
            availableCopies: libraryTable.availableCopies,
            publishedDate: libraryTable.publishedDate,
            shelfLocation: libraryTable.shelfLocation,
            subjectId: libraryTable.subjectId,
            createdAt: libraryTable.createdAt,
            updatedAt: libraryTable.updatedAt,
        })
        .from(libraryTable)
        .execute();

    return result.map(item => ({
        ...item,
        publishedDate: item.publishedDate ? new Date(item.publishedDate) : undefined, 
    })) as Library[];
};
