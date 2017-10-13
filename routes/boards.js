import { Router } from 'express';

import * as boardsController from '../controllers/boards';

import checkToken from '../middlewares/checkToken';
import getUser from '../middlewares/getUser';

const router = Router();

router.get('/boards', boardsController.getBoards);
router.post('/boards', checkToken, getUser, boardsController.createBoard); // Get user to define board creator
router.put('/boards/:_id', checkToken, boardsController.updateBoard); // Get user to define board creator
router.delete('/boards/:_id', checkToken, boardsController.deleteBoard);

export default router;
