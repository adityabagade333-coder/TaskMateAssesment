import { useState } from 'react';
import { X, Edit, Trash2, Calendar, Flag, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';

const TaskDetailModal = ({ isOpen, onClose, task, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !task) return null;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (completed, dueDate) => {
    if (completed) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    
    if (dueDate && new Date(dueDate) < new Date()) {
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
    
    return <Clock className="w-5 h-5 text-yellow-500" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formatted = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (diffDays === 0) return `${formatted} (Today)`;
    if (diffDays === 1) return `${formatted} (Tomorrow)`;
    if (diffDays === -1) return `${formatted} (Yesterday)`;
    if (diffDays > 0) return `${formatted} (In ${diffDays} days)`;
    if (diffDays < 0) return `${formatted} (${Math.abs(diffDays)} days overdue)`;
    
    return formatted;
  };

  const handleEdit = () => {
    onEdit(task);
    onClose();
  };

  const handleDeleteConfirm = () => {
    onDelete(task._id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleClose = () => {
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {getStatusIcon(task.completed, task.dueDate)}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Task Details
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <h3 className={`text-2xl font-bold ${
              task.completed 
                ? 'text-gray-500 dark:text-gray-400 line-through' 
                : 'text-gray-900 dark:text-gray-100'
            }`}>
              {task.title}
            </h3>
          </div>

          {/* Status and Priority */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status:</span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                task.completed 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {task.completed ? 'Completed' : 'In Progress'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Flag size={16} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Priority:</span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Description
              </h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}

          {/* Due Date */}
          <div className="flex items-center gap-3">
            <Calendar size={20} className="text-gray-400" />
            <div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Due Date:</span>
              <p className={`text-gray-900 dark:text-gray-100 ${
                task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
                  ? 'text-red-600 dark:text-red-400 font-medium'
                  : ''
              }`}>
                {formatDate(task.dueDate)}
              </p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Created:</span>
              <p className="text-gray-900 dark:text-gray-100">
                {new Date(task.createdAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Updated:</span>
              <p className="text-gray-900 dark:text-gray-100">
                {new Date(task.updatedAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          {!showDeleteConfirm ? (
            <>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  className="flex items-center gap-2"
                >
                  <Edit size={16} />
                  Edit Task
                </Button>
                
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete Task
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertTriangle size={20} />
                <span className="font-medium">Are you sure you want to delete this task?</span>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                
                <Button
                  variant="danger"
                  onClick={handleDeleteConfirm}
                >
                  Yes, Delete
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;