import express from 'express';
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  toggleTask,
  bulkUpdateTasks,
  bulkDeleteTasks,
  getTaskStats,
  createTaskValidation,
  updateTaskValidation
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Task routes
router.route('/')
  .get(getTasks)
  .post(createTaskValidation, createTask);

router.route('/stats')
  .get(getTaskStats);

router.route('/bulk')
  .put(bulkUpdateTasks)
  .delete(bulkDeleteTasks);

router.route('/:id')
  .get(getTask)
  .put(updateTaskValidation, updateTask)
  .delete(deleteTask);

router.route('/:id/toggle')
  .patch(toggleTask);

export default router;
