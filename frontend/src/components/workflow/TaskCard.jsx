import { Calendar, Flag, Edit, Trash2, Eye, MoreVertical } from 'lucide-react';
import { useState } from 'react';

const TaskCard = ({ task, onView, onDelete, onDragStart, onDragEnd }) => {
  const [showActions, setShowActions] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/10 dark:to-red-900/20';
      case 'medium': return 'border-l-amber-500 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/10 dark:to-amber-900/20';
      case 'low': return 'border-l-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/10 dark:to-emerald-900/20';
      default: return 'border-l-slate-300 bg-gradient-to-br from-white to-slate-50 dark:from-gray-800 dark:to-gray-800/50';
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50';
      case 'low': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/50';
      default: return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '🌱';
      default: return '📋';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { 
      text: 'Today', 
      className: 'text-orange-600 dark:text-orange-400 font-medium', 
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      urgent: true 
    };
    if (diffDays === 1) return { 
      text: 'Tomorrow', 
      className: 'text-blue-600 dark:text-blue-400', 
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      urgent: false 
    };
    if (diffDays < 0) return { 
      text: `${Math.abs(diffDays)}d overdue`, 
      className: 'text-red-600 dark:text-red-400 font-medium', 
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      urgent: true 
    };
    if (diffDays <= 7) return { 
      text: `${diffDays}d left`, 
      className: 'text-slate-600 dark:text-slate-400', 
      bgColor: 'bg-slate-100 dark:bg-slate-700',
      urgent: false 
    };
    
    return { 
      text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
      className: 'text-slate-600 dark:text-slate-400',
      bgColor: 'bg-slate-100 dark:bg-slate-700',
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

  const handleCardClick = () => {
    onView(task);
  };

  const handleView = (e) => {
    e.stopPropagation();
    onView(task);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onView(task);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task._id);
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleCardClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className={`${getPriorityColor(task.priority)} border-l-4 rounded-xl p-4 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative group ${
        isDragging ? 'opacity-60 rotate-3 scale-105 shadow-2xl' : ''
      } backdrop-blur-sm`}
    >
      {/* Priority Indicator */}
      <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-xs border-2 border-current">
        {getPriorityIcon(task.priority)}
      </div>

      {/* Action Buttons */}
      <div className={`absolute top-3 right-3 flex items-center gap-1 transition-all duration-300 ${
        showActions ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}>
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-1 shadow-lg border border-gray-200/50 dark:border-gray-600/50">
          <button
            onClick={handleView}
            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md transition-colors duration-200 group/btn"
            title="View details"
          >
            <Eye size={14} className="group-hover/btn:scale-110 transition-transform" />
          </button>
          <button
            onClick={handleEdit}
            className="p-2 hover:bg-amber-50 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-md transition-colors duration-200 group/btn"
            title="Edit task"
          >
            <Edit size={14} className="group-hover/btn:scale-110 transition-transform" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md transition-colors duration-200 group/btn"
            title="Delete task"
          >
            <Trash2 size={14} className="group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Task Content */}
      <div className="space-y-3">
        {/* Title */}
        <div className="pr-20">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug">
            {task.title}
          </h4>
        </div>
        
        {/* Description */}
        {task.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed opacity-75">
            {task.description}
          </p>
        )}

        {/* Tags Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Priority Badge */}
          <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityBadgeColor(task.priority)} transition-all duration-200`}>
            <Flag size={8} className="mr-1.5" />
            {task.priority}
          </div>

          {/* Due Date */}
          {dueDateInfo && (
            <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${dueDateInfo.bgColor} ${dueDateInfo.className} border border-current/20`}>
              <Calendar size={8} className="mr-1.5" />
              {dueDateInfo.text}
              {dueDateInfo.urgent && (
                <span className="ml-1.5 w-1.5 h-1.5 bg-current rounded-full animate-pulse" />
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <div className="w-1.5 h-1.5 bg-current rounded-full opacity-50"></div>
            <span>
              {new Date(task.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric'
              })}
            </span>
          </div>

          {/* Task Status Indicator */}
          <div className="flex items-center gap-1">
            {task.completed ? (
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" title="Completed" />
            ) : (
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" title="In Progress" />
            )}
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/0 via-purple-400/0 to-pink-400/0 group-hover:from-blue-400/5 group-hover:via-purple-400/5 group-hover:to-pink-400/5 transition-all duration-500 pointer-events-none" />
    </div>
  );
};

export default TaskCard;