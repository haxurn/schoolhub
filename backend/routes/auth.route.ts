// backend/routes/auth.route.ts

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

router.post('/login', authController.login.bind(authController));

export default router;