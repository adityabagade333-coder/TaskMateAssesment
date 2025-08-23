import { useState } from 'react';
import { Calendar, Flag, MoreVertical, Edit, Trash2 } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onDragStart, onDragEnd }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50 dark:bg-red-900/10';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10';
      case 'low': return 'border-l-green-500 bg-green-50 dark:bg-green-900/10';
      default: return 'border-l-gray-300 bg-white dark:bg-gray-800';
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { text: 'Today', className: 'text-orange-600 dark:text-orange-400', urgent: true };
    if (diffDays === 1) return { text: 'Tomorrow', className: 'text-blue-600 dark:text-blue-400', urgent: false };
    if (diffDays === -1) return { text: 'Yesterday', className: 'text-red-600 dark:text-red-400', urgent: true };
    if (diffDays > 0 && diffDays <= 7) return { text: `${diffDays}d`, className: 'text-gray-600 dark:text-gray-400', urgent: false };
    if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, className: 'text-red-600 dark:text-red-400', urgent: true };
    
    return { 
      text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
      className: 'text-gray-600 dark:text-gray-400',
      urgent: false 
    };
  };

  const dueDateInfo = formatDate(task.dueDate);

  const handleDragStart = (e) => {
    setIsDragging(true);
    onDragStart(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd();
  };

  const handleDropdownClick = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowDropdown(false);
    onEdit(task);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowDropdown(false);
    onDelete(task._id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`${getPriorityColor(task.priority)} border-l-4 rounded-lg p-3 sm:p-4 cursor-move shadow-sm hover:shadow-md transition-all duration-200 ${
        isDragging ? 'opacity-50 transform rotate-1 scale-105' : ''
      }`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 pr-2 leading-tight">
          {task.title}
        </h4>
        
        <div className="relative flex-shrink-0">
          <button
            onClick={handleDropdownClick}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            <MoreVertical size={14} className="text-gray-400" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20 border border-gray-200 dark:border-gray-700">
              <button
                onClick={handleEdit}
                className="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <Edit size={12} className="mr-2" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="w-full text-left px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <Trash2 size={12} className="mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Card Footer */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        {/* Priority Badge */}
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeColor(task.priority)}`}>
          <Flag size={8} className="mr-1" />
          {task.priority}
        </span>

        {/* Due Date */}
        {dueDateInfo && (
          <div className={`flex items-center text-xs ${dueDateInfo.className}`}>
            <Calendar size={10} className="mr-1" />
            {dueDateInfo.text}
            {dueDateInfo.urgent && (
              <span className="ml-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
        )}
      </div>

      {/* Created Date */}
      <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {new Date(task.createdAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: new Date(task.createdAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
          })}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;