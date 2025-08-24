const Task = require('../models/task.modal');
const mongoose = require('mongoose');

const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, status } = req.body;

    const task = await Task.create({
      title,
      description,
      priority: priority || 'medium',
      status: status || 'backlog',
      dueDate,
      user: req.user.userId
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating task',
      error: error.message
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const { completed, priority, status, sort = 'createdAt', order = 'desc', search, page = 1, limit = 100 } = req.query;
    
    let query = { user: req.user.userId };

    if (completed !== undefined) {
      query.completed = completed === 'true';
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sort]: sortOrder };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await Task.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      tasks
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message
    });
  }
};

const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user.userId 
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      task
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching task',
      error: error.message
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, completed, status } = req.body;

    const updateData = {
      title, 
      description, 
      priority, 
      dueDate,
      updatedAt: Date.now()
    };

    // Handle status updates
    if (status !== undefined) {
      updateData.status = status;
      updateData.completed = status === 'done';
    } else if (completed !== undefined) {
      updateData.completed = completed;
      updateData.status = completed ? 'done' : (updateData.status || 'in-progress');
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating task',
      error: error.message
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.userId 
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: error.message
    });
  }
};

const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const stats = await Task.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$completed', false] }, 1, 0] }
          },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$completed', false] },
                    { $lt: ['$dueDate', new Date()] },
                    { $ne: ['$dueDate', null] }
                  ]
                },
                1,
                0
              ]
            }
          },
          // Status breakdown
          backlog: {
            $sum: { $cond: [{ $eq: ['$status', 'backlog'] }, 1, 0] }
          },
          todo: {
            $sum: { $cond: [{ $eq: ['$status', 'todo'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
          },
          review: {
            $sum: { $cond: [{ $eq: ['$status', 'review'] }, 1, 0] }
          },
          done: {
            $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] }
          },
          // Priority breakdown
          lowPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] }
          },
          mediumPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] }
          },
          highPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      completed: 0,
      pending: 0,
      overdue: 0,
      backlog: 0,
      todo: 0,
      inProgress: 0,
      review: 0,
      done: 0,
      lowPriority: 0,
      mediumPriority: 0,
      highPriority: 0
    };

    const completionRate = result.total > 0 ? ((result.completed / result.total) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      stats: {
        total: result.total,
        completed: result.completed,
        pending: result.pending,
        overdue: result.overdue,
        byStatus: {
          backlog: result.backlog,
          todo: result.todo,
          'in-progress': result.inProgress,
          review: result.review,
          done: result.done
        },
        byPriority: {
          low: result.lowPriority,
          medium: result.mediumPriority,
          high: result.highPriority
        },
        completionRate: parseFloat(completionRate)
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching task statistics',
      error: error.message
    });
  }
};

const bulkOperations = async (req, res) => {
  try {
    const { action, taskIds, data } = req.body;
    const userId = req.user.userId;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Task IDs array is required'
      });
    }

    let result;

    switch (action) {
      case 'markCompleted':
        result = await Task.updateMany(
          { _id: { $in: taskIds }, user: userId },
          { completed: true, status: 'done' }
        );
        break;

      case 'markPending':
        result = await Task.updateMany(
          { _id: { $in: taskIds }, user: userId },
          { completed: false, status: 'todo' }
        );
        break;

      case 'updatePriority':
        if (!data || !data.priority) {
          return res.status(400).json({
            success: false,
            message: 'Priority is required for updatePriority action'
          });
        }
        result = await Task.updateMany(
          { _id: { $in: taskIds }, user: userId },
          { priority: data.priority }
        );
        break;

      case 'updateStatus':
        if (!data || !data.status) {
          return res.status(400).json({
            success: false,
            message: 'Status is required for updateStatus action'
          });
        }
        result = await Task.updateMany(
          { _id: { $in: taskIds }, user: userId },
          { 
            status: data.status,
            completed: data.status === 'done'
          }
        );
        break;

      case 'delete':
        result = await Task.deleteMany(
          { _id: { $in: taskIds }, user: userId }
        );
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action. Allowed actions: markCompleted, markPending, updatePriority, updateStatus, delete'
        });
    }

    res.status(200).json({
      success: true,
      message: `Bulk ${action} operation completed`,
      affectedCount: result.modifiedCount || result.deletedCount || 0
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error performing bulk operation',
      error: error.message
    });
  }
};

const toggleTaskStatus = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Toggle between done and in-progress
    if (task.status === 'done') {
      task.status = 'in-progress';
      task.completed = false;
    } else {
      task.status = 'done';
      task.completed = true;
    }

    await task.save();

    res.status(200).json({
      success: true,
      message: `Task marked as ${task.completed ? 'completed' : 'in progress'}`,
      task
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling task status',
      error: error.message
    });
  }
};

const duplicateTask = async (req, res) => {
  try {
    const originalTask = await Task.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!originalTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const duplicatedTask = await Task.create({
      title: `${originalTask.title} (Copy)`,
      description: originalTask.description,
      priority: originalTask.priority,
      dueDate: originalTask.dueDate,
      status: 'backlog',
      completed: false,
      user: req.user.userId
    });

    res.status(201).json({
      success: true,
      message: 'Task duplicated successfully',
      task: duplicatedTask
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error duplicating task',
      error: error.message
    });
  }
};

const getOverdueTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.userId,
      completed: false,
      dueDate: { $lt: new Date(), $ne: null }
    }).sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching overdue tasks',
      error: error.message
    });
  }
};

const getUpcomingTasks = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const upcomingDate = new Date();
    upcomingDate.setDate(upcomingDate.getDate() + parseInt(days));

    const tasks = await Task.find({
      user: req.user.userId,
      completed: false,
      dueDate: {
        $gte: new Date(),
        $lte: upcomingDate,
        $ne: null
      }
    }).sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      days: parseInt(days),
      tasks
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming tasks',
      error: error.message
    });
  }
};

module.exports = {
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
};