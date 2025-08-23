import { useState } from 'react';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

const StatusColumn = ({ 
  column, 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask, 
  onDragStart, 
  onDragEnd, 
  onDrop,
  isDragging 
}) => {
  const [dragOver, setDragOver] = useState(false);

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

  return (
    <div className="flex-shrink-0 w-72 sm:w-80">
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
            className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors group flex-shrink-0"
            title={`Add task to ${column.title}`}
          >
            <Plus size={16} className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Column Content */}
      <div
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
                  className="mt-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  + Add first task
                </button>
              )}
            </div>
          ) : (
            tasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              />
            ))
          )}
          
          {/* Drop Zone (visible when dragging) */}
          {isDragging && tasks.length > 0 && (
            <div className={`border-2 border-dashed rounded-lg p-3 sm:p-4 text-center text-sm transition-all duration-200 ${
              dragOver 
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400' 
                : 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
            }`}>
              Drop task here
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusColumn;