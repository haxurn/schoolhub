// backend/routes/auth.route.ts
import { Router } from 'express';
import { loginController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema } from '../schemas/auth.schema';
import { Handler } from '../utils/handler.util';

const router = Router();

router.post('/auth/login', validate(loginSchema), Handler(loginController));

export default router;
