import { Request, Response } from 'express';
import { getAdminByUsername, comparePassword } from '../models/adminModel';
import jwt from 'jsonwebtoken';
import { getFinanceRegistrarByUsername } from '../models/financeRegistrarModel';

// Admin login handler
// Admin login handler
export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        const admin = await getAdminByUsername(username);

        if (!admin) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }

        const isPasswordValid = await comparePassword(password, admin.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }

        // Generate token with role 'admin'
        const token = jwt.sign(
            { id: admin.id, username: admin.username, role: 'admin' },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error: any) {
        res.status(500).json({ message: 'Error logging in', error: error.message || error });
    }
};
// Finance login handler
export const loginFinanceRegistrar = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        const registrar = await getFinanceRegistrarByUsername(username);
        if (!registrar) {
            res.status(404).json({ message: 'Registrar not found' });
            return;
        }

        const isPasswordValid = await comparePassword(password, registrar.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid password' });
            return;
        }

        // Generate token
        const token = jwt.sign(
            { id: registrar.id, username: registrar.username, role: 'finance' },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error: any) {
        res.status(500).json({ message: 'Error logging in', error: error.message || error });
    }
};
