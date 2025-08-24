import { useState } from 'react';
import { Plus, GripVertical } from 'lucide-react';
import TaskCard from './TaskCard';

const StatusColumn = ({ 
  column, 
  tasks, 
  onAddTask, 
  onViewTask, 
  onDeleteTask,
  onStatusChange,
  onDragStart, 
  onDragEnd, 
  onDrop,
  isDragging 
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchTask, setTouchTask] = useState(null);
  const [longPressTimer, setLongPressTimer] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    onDrop(column.id);
  };

  // Mobile touch handlers for drag and drop
  const handleTouchStart = (e, task) => {
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    });
    setTouchTask(task);

    // Long press detection for drag initiation
    const timer = setTimeout(() => {
      if (touchTask && touchStart) {
        // Vibrate if available (mobile feedback)
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
        onDragStart(task);
      }
    }, 500); // 500ms for long press

    setLongPressTimer(timer);
  };

  const handleTouchMove = (e, task) => {
    if (!touchStart || !touchTask) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStart.x);
    const deltaY = Math.abs(touch.clientY - touchStart.y);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // If moved more than 10px, cancel long press
    if (distance > 10 && longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    // If dragging is active, prevent scrolling
    if (isDragging && touchTask._id === task._id) {
      e.preventDefault();
      
      // Get element under touch point
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      const dropZone = elementBelow?.closest('[data-column-id]');
      
      if (dropZone) {
        const columnId = dropZone.getAttribute('data-column-id');
        if (columnId && columnId !== column.id) {
          setDragOver(columnId === column.id);
        }
      }
    }
  };

  const handleTouchEnd = (e, task) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    if (!touchStart || !touchTask) {
      setTouchStart(null);
      setTouchTask(null);
      return;
    }

    const timeDiff = Date.now() - touchStart.time;
    
    // If dragging was active, handle drop
    if (isDragging && touchTask._id === task._id) {
      const touch = e.changedTouches[0];
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      const dropZone = elementBelow?.closest('[data-column-id]');
      
      if (dropZone) {
        const columnId = dropZone.getAttribute('data-column-id');
        if (columnId && columnId !== column.id) {
          onDrop(columnId);
        }
      }
      onDragEnd();
    } else if (timeDiff < 200) {
      // Quick tap - view task
      onViewTask(task);
    }

    setTouchStart(null);
    setTouchTask(null);
    setDragOver(false);
  };

  return (
    <div className="flex-shrink-0 w-64 sm:w-72 lg:w-80">
      {/* Column Header */}
      <div className={`rounded-t-lg p-3 sm:p-4 ${column.headerColor} border-b border-gray-200 dark:border-gray-600`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">
              {column.title}
            </h3>
            <span className="bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full font-medium">
              {column.count}
            </span>
          </div>
          <button
            onClick={onAddTask}
            className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors group flex-shrink-0 touch-manipulation"
            title={`Add task to ${column.title}`}
          >
            <Plus size={16} className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Column Content */}
      <div
        data-column-id={column.id}
        className={`${column.color} border-l border-r border-b border-gray-200 dark:border-gray-600 rounded-b-lg min-h-[400px] sm:min-h-[500px] transition-all duration-200 ${
          dragOver && isDragging ? 'bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-2 sm:p-3 space-y-2 sm:space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <div className="text-gray-400 dark:text-gray-500 text-sm">
                {isDragging ? 'Drop task here' : 'No tasks'}
              </div>
              {!isDragging && (
                <button
                  onClick={onAddTask}
                  className="mt-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors touch-manipulation"
                >
                  + Add first task
                </button>
              )}
            </div>
          ) : (
            tasks.map(task => (
              <div
                key={task._id}
                className="relative"
                onTouchStart={(e) => handleTouchStart(e, task)}
                onTouchMove={(e) => handleTouchMove(e, task)}
                onTouchEnd={(e) => handleTouchEnd(e, task)}
              >
                {/* Mobile Drag Handle */}
                <div className="absolute left-1 top-1/2 -translate-y-1/2 z-10 sm:hidden opacity-60">
                  <GripVertical 
                    size={16} 
                    className="text-gray-400 dark:text-gray-500 touch-manipulation" 
                  />
                </div>
                
                <TaskCard
                  task={task}
                  onView={onViewTask}
                  onDelete={onDeleteTask}
                  onStatusChange={onStatusChange}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  className={`${
                    isDragging && touchTask?._id === task._id 
                      ? 'opacity-50 scale-105 rotate-2 z-50' 
                      : ''
                  }`}
                />
              </div>
            ))
          )}
          
          {/* Drop Zone (visible when dragging) */}
          {isDragging && (
            <div className={`border-2 border-dashed rounded-lg p-3 sm:p-4 text-center text-sm transition-all duration-200 ${
              dragOver 
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400' 
                : 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
            }`}>
              <div className="flex flex-col items-center gap-2">
                <div className="text-lg">📋</div>
                <span>Drop task here</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Instructions */}
      <div className="sm:hidden mt-2 text-xs text-gray-500 dark:text-gray-400 text-center px-2">
        Long press and drag to move tasks
      </div>
    </div>
  );
};

export default StatusColumn;