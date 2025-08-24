import { useState, useEffect } from 'react';
import { tasksAPI } from '../../services/api';
import TaskFormModal from '../tasks/TaskFormModal';
import TaskDetailModal from '../tasks/TaskDetailModal';
import StatusColumn from './StatusColumn';
import Loading from '../ui/Loading';
import { toast } from 'react-hot-toast';

const WorkflowBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [taskModalLoading, setTaskModalLoading] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const [createInColumn, setCreateInColumn] = useState(null);

  const columns = [
    { 
      id: 'todo', 
      title: 'To Do', 
      color: 'bg-gray-100 dark:bg-gray-700',
      headerColor: 'bg-gray-200 dark:bg-gray-600',
      count: 0
    },
    { 
      id: 'in-progress', 
      title: 'In Progress', 
      color: 'bg-blue-50 dark:bg-blue-900/10',
      headerColor: 'bg-blue-100 dark:bg-blue-900/30',
      count: 0
    },
    { 
      id: 'review', 
      title: 'Review', 
      color: 'bg-yellow-50 dark:bg-yellow-900/10',
      headerColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      count: 0
    },
    { 
      id: 'testing', 
      title: 'Testing', 
      color: 'bg-purple-50 dark:bg-purple-900/10',
      headerColor: 'bg-purple-100 dark:bg-purple-900/30',
      count: 0
    },
    { 
      id: 'done', 
      title: 'Done', 
      color: 'bg-green-50 dark:bg-green-900/10',
      headerColor: 'bg-green-100 dark:bg-green-900/30',
      count: 0
    }
  ];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getTasks({ limit: 100, sort: 'createdAt', order: 'desc' });
      setTasks(response.tasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const getTaskStatus = (task) => {
    if (task.completed) return 'done';
    if (task.status) return task.status;
    return 'todo';
  };

  const getTasksByColumn = (columnId) => {
    return tasks.filter(task => getTaskStatus(task) === columnId);
  };

  const getColumnsWithCounts = () => {
    return columns.map(column => ({
      ...column,
      count: getTasksByColumn(column.id).length
    }));
  };

  const handleCreateTask = async (taskData) => {
    try {
      setTaskModalLoading(true);
      const response = await tasksAPI.createTask({
        ...taskData,
        completed: (createInColumn || 'todo') === 'done'
      });
      setTasks(prev => [response.task, ...prev]);
      setShowTaskModal(false);
      setCreateInColumn(null);
      setModalMode('create');
      toast.success('Task created successfully!');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    } finally {
      setTaskModalLoading(false);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      setTaskModalLoading(true);
      const response = await tasksAPI.updateTask(selectedTask._id, taskData);
      setTasks(prev => prev.map(task => 
        task._id === selectedTask._id ? response.task : task
      ));
      setShowTaskModal(false);
      setSelectedTask(null);
      setModalMode('create');
      toast.success('Task updated successfully!');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    } finally {
      setTaskModalLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await tasksAPI.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task._id !== taskId));
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setModalMode('view');
    setShowTaskModal(true);
  };

  const handleAddTask = (columnId) => {
    setCreateInColumn(columnId);
    setSelectedTask(null);
    setModalMode('create');
    setShowTaskModal(true);
  };

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDrop = async (columnId) => {
    if (!draggedTask) return;

    const currentStatus = getTaskStatus(draggedTask);
    if (currentStatus === columnId) return;

    try {
      const updatedData = {
        title: draggedTask.title,
        description: draggedTask.description || '',
        priority: draggedTask.priority,
        dueDate: draggedTask.dueDate,
        completed: columnId === 'done'
      };

      await tasksAPI.updateTask(draggedTask._id, updatedData);
      
      setTasks(prev => prev.map(task => 
        task._id === draggedTask._id 
          ? { ...task, status: columnId, completed: columnId === 'done' }
          : task
      ));
      
      const columnTitle = columns.find(col => col.id === columnId)?.title;
      toast.success(`Task moved to ${columnTitle}`);
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to move task');
    }
    
    setDraggedTask(null);
  };

  const handleCloseModal = () => {
    setShowTaskModal(false);
    setSelectedTask(null);
    setCreateInColumn(null);
    setModalMode('create');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loading size="lg" text="Loading workflow..." />
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Board Container */}
      <div className="workflow-scroll flex gap-3 md:gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-220px)]">
        {getColumnsWithCounts().map(column => (
          <StatusColumn
            key={column.id}
            column={column}
            tasks={getTasksByColumn(column.id)}
            onAddTask={() => handleAddTask(column.id)}
            onViewTask={handleViewTask}
            onDeleteTask={handleDeleteTask}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            isDragging={!!draggedTask}
          />
        ))}
      </div>

      {/* Task Modal */}
      <TaskFormModal
        isOpen={showTaskModal}
        onClose={handleCloseModal}
        onSubmit={modalMode === 'create' ? handleCreateTask : handleUpdateTask}
        onDelete={handleDeleteTask}
        task={selectedTask}
        loading={taskModalLoading}
        mode={modalMode}
      />
    </div>
  );
};

export default WorkflowBoard;