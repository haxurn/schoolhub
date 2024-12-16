import { Request, Response } from 'express';
import { prisma } from '../config/db.config';
import { documentSchema } from '../schema/'; 
import { deleteFiles } from '../utils/document.utils'; 

// Create a new document
export const createDocument = async (req: Request, res: Response) => {
    try {
        const documentData = req.body;

        documentSchema.parse(documentData); 

        const createdDocument = await prisma.document.create({
            data: {
                ...documentData,
            },
        });

        return res.status(201).json({
            message: "Document created successfully",
            document: createdDocument,
        });
    } catch (error) {
        console.error("❌ Error creating document:", error);
        return res.status(400).json({ error: error instanceof Error ? error.message : 'Internal server error' });
    }
};

export const getDocumentById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const document = await prisma.document.findUnique({
            where: { id },
        });

        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }

        return res.status(200).json(document);
    } catch (error) {
        console.error("❌ Error retrieving document:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


export const updateDocument = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        documentSchema.parse(updateData); 

        const updatedDocument = await prisma.document.update({
            where: { id },
            data: updateData,
        });

        return res.status(200).json({
            message: "Document updated successfully",
            document: updatedDocument,
        });
    } catch (error) {
        console.error("❌ Error updating document:", error);
        return res.status(400).json({ error: error instanceof Error ? error.message : 'Internal server error' });
    }
};

export const deleteDocument = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const document = await prisma.document.findUnique({
            where: { id },
        });

        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }

        await deleteFiles([document.fileUrl]);

        await prisma.document.delete({
            where: { id },
        });

        return res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting document:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
