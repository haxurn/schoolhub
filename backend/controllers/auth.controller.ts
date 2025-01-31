import { Request, Response } from 'express';
import { login, generatePasswordResetToken, resetPassword } from '../services/auth.service';
import { AppError } from '../utils/appError.util';
import geoip from 'geoip-lite'; // For geolocation lookup
import requestIp from 'request-ip'; 
import { logAction } from '../utils/logger.util'; // Import the logging utility



const getClientDetails = (req: Request) => {
    const ip = requestIp.getClientIp(req); // Extract client IP
    const geo = ip ? geoip.lookup(ip) : null; // Lookup geolocation if IP exists

    return {
        ip: ip || 'Unknown IP',
        userAgent: req.headers['user-agent'] || 'Unknown User-Agent',
        geoLocation: geo || 'Geolocation not found',
    };
};
// Login Controller

export const loginController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response = await login(req.body, req);
        const clientDetails = getClientDetails(req);
        // Log the login action with actionType set to "Authentication"
        logAction({
            userId: response.user.id,   
            action: 'LOGIN',
            actionType: 'Authentication',
            details: clientDetails,
        });
        return res.status(200).json(response);
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error('Unexpected error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Password Reset Request Controller
export const passwordResetRequestController = async (req: Request, res: Response): Promise<Response> => {

    const clientDetails = getClientDetails(req);
    // Log the password reset request action
    logAction({
        action: 'PASSWORD_RESET_REQUEST',
        actionType: 'Authentication',
        details: clientDetails,
    });

    try {
        await generatePasswordResetToken(req.body.email);
        return res.status(200).json({ message: 'Password reset link sent to your email.' });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error('Unexpected error during password reset request:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Password Reset Controller
export const passwordResetController = async (req: Request, res: Response): Promise<Response> => {
    const { token, newPassword } = req.body;
    const clientDetails = getClientDetails(req);
    // Log the password reset action
    logAction({
        action: 'PASSWORD_RESET',
        actionType: 'Authentication',
        details: clientDetails,
    });

    try {
        await resetPassword(token, newPassword);
        return res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error('Unexpected error during password reset:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};