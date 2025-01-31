// backend/utils/handler.util.ts
import { Request, Response, NextFunction } from 'express';

/**
 * Utility to handle async middleware and controllers in Express.
 * Ensures proper error handling by forwarding errors to the next middleware.
 * 
 * @param fn - An async function to be wrapped
 * @returns A function compatible with Express middleware
 */
export const Handler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
