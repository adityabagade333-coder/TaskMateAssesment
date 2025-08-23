const express = require('express');
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getTaskStats,
  bulkOperations,
  toggleTaskStatus,
  duplicateTask,
  getOverdueTasks,
  getUpcomingTasks
} = require('../controllers/task.controller');
const auth = require('../middleware/auth.middleware');
const { validateTask, validateBulkOperation } = require('../validations/task.validation');

const router = express.Router();

router.use(auth);

router.get('/stats', getTaskStats);
router.get('/overdue', getOverdueTasks);
router.get('/upcoming', getUpcomingTasks);
router.put('/bulk', validateBulkOperation, bulkOperations);

router.post('/', validateTask, createTask);
router.get('/', getTasks);
router.get('/:id', getTask);
router.put('/:id', validateTask, updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/toggle', toggleTaskStatus);
router.post('/:id/duplicate', duplicateTask);

module.exports = router;