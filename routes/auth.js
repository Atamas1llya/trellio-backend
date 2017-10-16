import { Router } from 'express';

import * as authController from '../controllers/auth';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/login/google', authController.googleLogin);

export default router;
