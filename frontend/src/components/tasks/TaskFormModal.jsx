import { useState, useEffect } from 'react';
import { X, Calendar, Flag, AlignLeft, Type, Edit, Trash2, AlertTriangle, ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { ButtonLoading } from '../ui/Loading';

const TaskFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  onDelete,
  task = null, 
  loading = false,
  mode = 'create' // 'create', 'edit', 'view'
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: ''
      });
    }
    setErrors({});
    setIsEditing(mode === 'edit' || mode === 'create');
    setShowDeleteConfirm(false);
  }, [task, isOpen, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    if (formData.title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }
    if (formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const taskData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate || null
    };

    onSubmit(taskData);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (mode === 'view') {
      setIsEditing(false);
      // Reset form data to original task data
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
      });
      setErrors({});
    } else {
      handleClose();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(task._id);
    }
    setShowDeleteConfirm(false);
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setErrors({});
      setIsEditing(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteConfirmClose = () => {
    setShowDeleteConfirm(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  const isViewMode = mode === 'view' && !isEditing;
  const isCreateMode = mode === 'create';
  const canEdit = task && onSubmit;
  const canDelete = task && onDelete;

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {isCreateMode ? 'Create New Task' : 
               isViewMode ? 'Task Details' : 'Edit Task'}
            </h2>
            <button
              onClick={handleClose}
              disabled={loading}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {isViewMode ? (
            /* View Mode */
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

              {/* Priority and Status */}
              <div className="flex items-center gap-4 flex-wrap">
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
                  <p className="text-gray-900 dark:text-gray-100 text-sm">
                    {new Date(task.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Updated:</span>
                  <p className="text-gray-900 dark:text-gray-100 text-sm">
                    {new Date(task.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* View Mode Actions */}
              <div className="flex items-center justify-between pt-4">
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                
                <div className="flex gap-3">
                  {canEdit && (
                    <Button
                      onClick={handleEdit}
                      className="flex items-center gap-2"
                    >
                      <Edit size={16} />
                      Edit Task
                    </Button>
                  )}
                  
                  {canDelete && (
                    <Button
                      variant="danger"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Edit/Create Mode */
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Type size={16} className="mr-2" />
                  Task Title *
                </label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter task title..."
                  error={errors.title}
                  maxLength="100"
                  disabled={loading}
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.title.length}/100 characters
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <AlignLeft size={16} className="mr-2" />
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter task description..."
                  rows="3"
                  maxLength="500"
                  disabled={loading}
                  className={`w-full px-3 py-2 text-sm bg-white border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 resize-none ${
                    errors.description 
                      ? 'border-red-500 focus:ring-red-500 dark:border-red-400' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.description && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.description}</p>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.description.length}/500 characters
                </div>
              </div>

              {/* Priority and Due Date Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Priority */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Flag size={16} className="mr-2" />
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar size={16} className="mr-2" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    disabled={loading}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Priority Preview */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Priority Level:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(formData.priority)}`}>
                    {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
                  </span>
                </div>
                {formData.dueDate && (
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-600 dark:text-gray-400">Due:</span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {new Date(formData.dueDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancelEdit}
                  disabled={loading}
                  className="flex-1 sm:flex-none sm:w-24"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !formData.title.trim()}
                  className="flex-1"
                >
                  {loading ? <ButtonLoading /> : (
                    isCreateMode ? 'Create Task' : 'Update Task'
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-in fade-in-0 zoom-in-95">
            {/* Header */}
            <div className="flex items-start gap-4 p-6 pb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center border-2 border-red-200 dark:border-red-800/50">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Delete Task
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This action cannot be undone
                </p>
              </div>
              <button
                onClick={handleDeleteConfirmClose}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-2">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to permanently delete this task?
              </p>
              
              {/* Task Preview */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border-l-4 border-red-400 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
                      {task?.title || "Untitled Task"}
                    </p>
                    {task?.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-6">
                All associated data will be permanently removed
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 p-6 pt-0 sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={handleDeleteConfirmClose}
                className="w-full sm:w-auto"
              >
                <ArrowLeft size={16} className="mr-2" />
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={handleDelete}
                className="w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Delete Task
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskFormModal;