// backend/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'An unexpected error occurred' });
};

export default errorHandler;
