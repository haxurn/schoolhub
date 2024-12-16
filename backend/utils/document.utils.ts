// backend/utils/document.utils.ts

import { Document } from '../schema/index'; 
import fs from 'fs';
import path from 'path';

export const deleteFileByUrl = async (fileUrl: string) => {
    try {
        const filePath = path.resolve(fileUrl); 
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); 
            console.log(`✅ Deleted file at: ${fileUrl}`);
        } else {
            console.log(`❌ File not found: ${fileUrl}`);
        }
    } catch (error) {
        console.error(`❌ Error deleting file at ${fileUrl}:`, error);
        throw error; 
    }
};


export const deleteFiles = async (fileUrls: string[]) => {
    try {
        await Promise.all(fileUrls.map(async (url) => {
            await deleteFileByUrl(url); 
        }));
        console.log("✅  Files deleted successfully.");
    } catch (error) {
        console.error("❌ Error deleting files:", error);
        throw error; 
    }
};


export const deleteDocuments = async (documents: Document[]) => {
    const fileUrls = documents.map(doc => doc.fileUrl); 
    return deleteFiles(fileUrls); 
};
