import { Router } from 'express';

import * as profileController from '../controllers/profile';

import checkToken from '../middlewares/checkToken';
import getUser from '../middlewares/getUser';

const router = Router();

router.get('/profile', checkToken, getUser, profileController.getProfile);

export default router;
