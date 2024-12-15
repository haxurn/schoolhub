    import path from 'path';
    import multer, { FileFilterCallback } from 'multer';
    import { Request } from 'express';

   
    const storage = multer.diskStorage({
        destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
            cb(null, 'uploads/');
        },
        filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const fileExtension = path.extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
        }
    });

  
    function checkFileType(file: Express.Multer.File, cb: FileFilterCallback) {
        const filetypes = /jpeg|jpg|png|pdf|svg/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('File upload only supports the following filetypes - jpeg, jpg, png, pdf, svg'));
        }
    } 

    
    export const upload = multer({
        storage,
        limits: { fileSize: 20 * 1024 * 1024 }, 
        fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => checkFileType(file, cb)
    });
