import express, {Request, Response} from 'express';
import { registerStudent, loginStudent } from '../controllers/studentController';
import { validateStudentRegistration } from '../middleware/studentMiddleware';

export const router = express.Router();

// Register a new student
router.post('/register', validateStudentRegistration, registerStudent);

// Login student
router.post('/login', async (req: Request, res: Response) => {
    await loginStudent(req, res);

});

export default router;