import { Calendar, Flag, Edit, Trash2, Eye, MoreVertical, CheckCircle, Clock, PlayCircle, Pause } from 'lucide-react';
import { useState } from 'react';

const TaskCard = ({ task, onView, onDelete, onStatusChange, onDragStart, onDragEnd }) => {
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

  const getStatusIcon = (task) => {
    const status = task.status || (task.completed ? 'done' : 'backlog');
    switch (status) {
      case 'done': return { icon: CheckCircle, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30' };
      case 'in-progress': return { icon: PlayCircle, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' };
      case 'review': return { icon: Clock, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30' };
      case 'todo': return { icon: PlayCircle, color: 'text-slate-600 dark:text-slate-400', bgColor: 'bg-slate-100 dark:bg-slate-700' };
      default: return { icon: Pause, color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-700' };
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

  const getNextStatus = (currentTask) => {
    const currentStatus = currentTask.status || (currentTask.completed ? 'done' : 'backlog');
    const statusFlow = ['backlog', 'todo', 'in-progress', 'review', 'done'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    
    if (currentIndex === -1 || currentIndex === statusFlow.length - 1) {
      return statusFlow[0]; // Reset to backlog if at end or unknown status
    }
    return statusFlow[currentIndex + 1];
  };

  const dueDateInfo = formatDate(task.dueDate);
  const statusInfo = getStatusIcon(task);

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

  const handleStatusToggle = (e) => {
    e.stopPropagation();
    const nextStatus = getNextStatus(task);
    onStatusChange(task._id, nextStatus);
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

  const StatusIcon = statusInfo.icon;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleCardClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className={`${getPriorityColor(task.priority)} border-l-4 rounded-xl p-3 sm:p-4 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative group ${
        isDragging ? 'opacity-60 rotate-3 scale-105 shadow-2xl' : ''
      } backdrop-blur-sm`}
    >
      {/* Priority Indicator */}
      <div className="absolute -top-1 -left-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-xs border-2 border-current">
        <span className="text-[10px] sm:text-xs">{getPriorityIcon(task.priority)}</span>
      </div>

      {/* Status Toggle Button */}
      <div className="absolute -top-1 -right-1">
        <button
          onClick={handleStatusToggle}
          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full ${statusInfo.bgColor} ${statusInfo.color} shadow-md flex items-center justify-center border-2 border-white dark:border-gray-800 transition-all duration-200 hover:scale-110 active:scale-95`}
          title={`Change status from ${task.status || 'backlog'} to ${getNextStatus(task)}`}
        >
          <StatusIcon size={12} className="sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Action Buttons - Desktop */}
      <div className={`absolute top-3 right-3 hidden sm:flex items-center gap-1 transition-all duration-300 ${
        showActions ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}>
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-1 shadow-lg border border-gray-200/50 dark:border-gray-600/50">
          <button
            onClick={handleView}
            className="p-1.5 sm:p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md transition-colors duration-200 group/btn"
            title="View details"
          >
            <Eye size={12} className="sm:w-3.5 sm:h-3.5 group-hover/btn:scale-110 transition-transform" />
          </button>
          <button
            onClick={handleEdit}
            className="p-1.5 sm:p-2 hover:bg-amber-50 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-md transition-colors duration-200 group/btn"
            title="Edit task"
          >
            <Edit size={12} className="sm:w-3.5 sm:h-3.5 group-hover/btn:scale-110 transition-transform" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 sm:p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md transition-colors duration-200 group/btn"
            title="Delete task"
          >
            <Trash2 size={12} className="sm:w-3.5 sm:h-3.5 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Mobile Actions Menu */}
      <div className="absolute top-2 right-2 sm:hidden">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowActions(!showActions);
          }}
          className="p-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-200/50 dark:border-gray-600/50 text-gray-600 dark:text-gray-400"
        >
          <MoreVertical size={14} />
        </button>
        
        {showActions && (
          <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-10 min-w-[120px]">
            <button
              onClick={handleView}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            >
              <Eye size={14} />
              View
            </button>
            <button
              onClick={handleEdit}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors"
            >
              <Edit size={14} />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Task Content */}
      <div className="space-y-2 sm:space-y-3 mt-2">
        {/* Title */}
        <div className="pr-8 sm:pr-20">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug">
            {task.title}
          </h4>
        </div>
        
        {/* Description */}
        {task.description && (
          <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed opacity-75">
            {task.description}
          </p>
        )}

        {/* Tags Row */}
        <div className="flex items-center justify-between gap-1 sm:gap-2 flex-wrap">
          {/* Priority Badge */}
          <div className={`inline-flex items-center px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border ${getPriorityBadgeColor(task.priority)} transition-all duration-200 flex-shrink-0`}>
            <Flag size={6} className="mr-1 sm:mr-1.5 w-2 h-2 sm:w-2.5 sm:h-2.5" />
            <span className="hidden xs:inline">{task.priority}</span>
            <span className="xs:hidden">{task.priority.charAt(0).toUpperCase()}</span>
          </div>

          {/* Due Date */}
          {dueDateInfo && (
            <div className={`inline-flex items-center px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${dueDateInfo.bgColor} ${dueDateInfo.className} border border-current/20 flex-shrink-0`}>
              <Calendar size={6} className="mr-1 sm:mr-1.5 w-2 h-2 sm:w-2.5 sm:h-2.5" />
              <span className="truncate max-w-[60px] sm:max-w-none">{dueDateInfo.text}</span>
              {dueDateInfo.urgent && (
                <span className="ml-1 sm:ml-1.5 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-current rounded-full animate-pulse flex-shrink-0" />
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-current rounded-full opacity-50"></div>
            <span className="truncate">
              {new Date(task.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric'
              })}
            </span>
          </div>

          {/* Current Status Indicator */}
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${statusInfo.color.replace('text-', 'bg-')} rounded-full animate-pulse`} 
                 title={`Status: ${task.status || (task.completed ? 'done' : 'backlog')}`} />
            <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 hidden sm:inline capitalize">
              {(task.status || (task.completed ? 'done' : 'backlog')).replace('-', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/0 via-purple-400/0 to-pink-400/0 group-hover:from-blue-400/5 group-hover:via-purple-400/5 group-hover:to-pink-400/5 transition-all duration-500 pointer-events-none" />
    </div>
  );
};

export default TaskCard;