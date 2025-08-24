const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['backlog', 'todo', 'in-progress', 'review', 'done'],
    default: 'backlog'
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
taskSchema.index({ user: 1, createdAt: -1 });
taskSchema.index({ user: 1, status: 1 });

// Middleware to update completed field based on status
taskSchema.pre('save', function() {
  this.completed = this.status === 'done';
});

module.exports = mongoose.model('Task', taskSchema);