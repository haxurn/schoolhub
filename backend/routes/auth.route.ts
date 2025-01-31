// backend/routes/auth.route.ts
import { Router } from 'express';
import { loginController, passwordResetRequestController, passwordResetController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema, passwordResetRequestSchema, passwordResetSchema } from '../schemas/auth.schema';
import { Handler } from '../utils/handler.util';

const router = Router();

// Login Route
router.post('/auth/login', validate(loginSchema), Handler(loginController));

// Password Reset Request Route
router.post('/auth/password-reset-request', validate(passwordResetRequestSchema), Handler(passwordResetRequestController));

// Password Reset Route
router.post('/auth/reset-password', validate(passwordResetSchema), Handler(passwordResetController));

export default router;