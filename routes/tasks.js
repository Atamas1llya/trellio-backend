import { Router } from 'express';

import * as tasksController from '../controllers/tasks';

import checkToken from '../middlewares/checkToken';
import getUser from '../middlewares/getUser';

const router = Router();

router.get('/boards/:board_id/tasks', tasksController.getTasks);
router.get('/boards/tasks', tasksController.getAllTasks);
router.post('/boards/:board_id/tasks', checkToken, getUser, tasksController.createTask);
// board_id is not required, but...
router.patch('/boards/:board_id/tasks/:task_id/:status', checkToken, tasksController.updateTaskStatus);
router.put('/boards/:board_id/tasks/:task_id', checkToken, tasksController.updateTask);
router.put('/boards/:board_id/tasks/:task_id/attachment', checkToken, tasksController.attachFile);
router.delete('/boards/:board_id/tasks/:task_id', checkToken, tasksController.deleteTask);

export default router;
