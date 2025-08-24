import { Calendar, Flag, Edit, Trash2, Eye, MoreVertical, CheckCircle, Clock, PlayCircle, Pause, GripVertical, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

const TaskCard = ({ task, onView, onDelete, onStatusChange, onDragStart, onDragEnd }) => {
  const [showActions, setShowActions] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [touchStartPos, setTouchStartPos] = useState(null);
  const [dragTimer, setDragTimer] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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
      return statusFlow[0];
    }
    return statusFlow[currentIndex + 1];
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStartPos({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    });

    const timer = setTimeout(() => {
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      setIsDragging(true);
      onDragStart(task);
    }, 800);
    
    setDragTimer(timer);
  };

  const handleTouchMove = (e) => {
    if (!touchStartPos) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPos.x);
    const deltaY = Math.abs(touch.clientY - touchStartPos.y);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > 15 && dragTimer) {
      clearTimeout(dragTimer);
      setDragTimer(null);
    }

    if (isDragging) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e) => {
    if (dragTimer) {
      clearTimeout(dragTimer);
      setDragTimer(null);
    }

    if (isDragging) {
      const touch = e.changedTouches[0];
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      const dropZone = elementBelow?.closest('[data-column-id]');
      
      if (dropZone) {
        const columnId = dropZone.getAttribute('data-column-id');
        if (columnId && onDragStart) {
          onDragStart(columnId);
        }
      }
      setIsDragging(false);
      onDragEnd();
    } else if (touchStartPos && (Date.now() - touchStartPos.time) < 300) {
      onView(task);
    }

    setTouchStartPos(null);
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

  const handleCardClick = (e) => {
    if (e.target.closest('button') || isDragging || showDeleteConfirmation) {
      return;
    }
    onView(task);
  };

  const handleStatusToggle = (e) => {
    e.stopPropagation();
    if (showDeleteConfirmation) return;
    const nextStatus = getNextStatus(task);
    onStatusChange(task._id, nextStatus);
  };

  const handleView = (e) => {
    e.stopPropagation();
    setShowActions(false);
    onView(task);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowActions(false);
    onView(task);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowActions(false);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = (e) => {
    e.stopPropagation();
    onDelete(task._id);
    setShowDeleteConfirmation(false);
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirmation(false);
  };

  const StatusIcon = statusInfo.icon;

  return (
    <div className="relative w-full h-auto" style={{ perspective: '1000px' }}>
      <div 
        className={`relative w-full transition-transform duration-700 ${showDeleteConfirmation ? 'rotate-y-180' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of Card */}
        <div
          draggable={!showDeleteConfirmation}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={handleCardClick}
          className={`${getPriorityColor(task.priority)} border-l-4 rounded-xl p-4 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative group ${
            isDragging ? 'opacity-60 rotate-3 scale-105 shadow-2xl z-50' : ''
          } backdrop-blur-sm select-none`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-xs border-2 border-current">
            <span className="text-xs">{getPriorityIcon(task.priority)}</span>
          </div>

          <div className="flex justify-between items-start mb-3 sm:hidden">
            <button
              onClick={handleStatusToggle}
              className={`w-8 h-8 rounded-full ${statusInfo.bgColor} ${statusInfo.color} shadow-md flex items-center justify-center border-2 border-white dark:border-gray-800 transition-all duration-200 hover:scale-110 active:scale-95`}
            >
              <StatusIcon size={16} />
            </button>

            <div className="flex items-center gap-2">
              <div className="sm:hidden opacity-60">
                <GripVertical size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(!showActions);
                  }}
                  className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-200/50 dark:border-gray-600/50 text-gray-600 dark:text-gray-400"
                >
                  <MoreVertical size={16} />
                </button>
                
                {showActions && (
                  <>
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActions(false);
                      }}
                    />
                    
                    <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-20 min-w-[120px]">
                      <button
                        onClick={handleView}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors first:rounded-t-lg"
                      >
                        <Eye size={16} />
                        View
                      </button>
                      <button
                        onClick={handleEdit}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors border-t border-gray-200 dark:border-gray-600"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors border-t border-gray-200 dark:border-gray-600 last:rounded-b-lg"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="absolute -top-1 -right-1 hidden sm:block">
            <button
              onClick={handleStatusToggle}
              className={`w-7 h-7 rounded-full ${statusInfo.bgColor} ${statusInfo.color} shadow-md flex items-center justify-center border-2 border-white dark:border-gray-800 transition-all duration-200 hover:scale-110 active:scale-95`}
            >
              <StatusIcon size={14} />
            </button>
          </div>

          <div className={`absolute top-3 right-3 hidden sm:flex items-center gap-1 transition-all duration-300 ${
            showActions ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
          >
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-1 shadow-lg border border-gray-200/50 dark:border-gray-600/50">
              <button
                onClick={handleView}
                className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md transition-colors duration-200"
              >
                <Eye size={14} />
              </button>
              <button
                onClick={handleEdit}
                className="p-2 hover:bg-amber-50 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-md transition-colors duration-200"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md transition-colors duration-200"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div className="space-y-3 mt-0 sm:mt-2">
            <div className="pr-2 sm:pr-20">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug">
                {task.title}
              </h4>
            </div>
            
            {task.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed opacity-75">
                {task.description}
              </p>
            )}

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityBadgeColor(task.priority)} transition-all duration-200 flex-shrink-0`}>
                <Flag size={10} className="mr-1.5" />
                <span className="hidden xs:inline">{task.priority}</span>
                <span className="xs:hidden">{task.priority.charAt(0).toUpperCase()}</span>
              </div>

              {dueDateInfo && (
                <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${dueDateInfo.bgColor} ${dueDateInfo.className} border border-current/20 flex-shrink-0`}>
                  <Calendar size={10} className="mr-1.5" />
                  <span className="truncate max-w-[80px] sm:max-w-none">{dueDateInfo.text}</span>
                  {dueDateInfo.urgent && (
                    <span className="ml-1.5 w-1.5 h-1.5 bg-current rounded-full animate-pulse flex-shrink-0" />
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <div className="w-1.5 h-1.5 bg-current rounded-full opacity-50"></div>
                <span className="truncate">
                  {new Date(task.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric'
                  })}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 ${statusInfo.color.replace('text-', 'bg-')} rounded-full animate-pulse`} />
                <span className="text-[10px] text-gray-500 dark:text-gray-400 hidden sm:inline capitalize">
                  {(task.status || (task.completed ? 'done' : 'backlog')).replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/0 via-purple-400/0 to-pink-400/0 group-hover:from-blue-400/5 group-hover:via-purple-400/5 group-hover:to-pink-400/5 transition-all duration-500 pointer-events-none" />
          
          {isDragging && (
            <div className="absolute inset-0 rounded-xl border-2 border-dashed border-blue-400 bg-blue-50/20 dark:bg-blue-900/20 flex items-center justify-center">
              <div className="text-blue-600 dark:text-blue-400 font-medium text-sm bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-lg shadow-md">
                Dragging...
              </div>
            </div>
          )}
        </div>

        {/* Back of Card - Delete Confirmation */}
        <div 
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30 border-l-4 border-l-red-500 rounded-xl p-4 shadow-xl flex flex-col justify-center items-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center space-y-4 w-full">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center border-4 border-red-200 dark:border-red-800">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-1">
                Delete Task?
              </h3>
              <p className="text-sm text-red-600 dark:text-red-300">
                This action cannot be undone
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancelDelete}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium shadow-sm border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
              >
                <ArrowLeft size={16} />
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-lg transition-all duration-200"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;