import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Edit, Save, X, Eye, EyeOff, CheckCircle, Clock, AlertTriangle, Target, TrendingUp, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ButtonLoading } from '../components/ui/Loading';
import { tasksAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    byStatus: {
      backlog: 0,
      todo: 0,
      'in-progress': 0,
      review: 0,
      done: 0
    },
    byPriority: {
      high: 0,
      medium: 0,
      low: 0
    },
    completionRate: 0,
    recentlyCompleted: []
  });
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  useEffect(() => {
    fetchTaskStats();
  }, []);

  const fetchTaskStats = async () => {
    try {
      setStatsLoading(true);
      
      // Fetch all tasks
      const tasksResponse = await tasksAPI.getTasks({ limit: 1000 });
      const tasks = tasksResponse.tasks || [];
      
      // Calculate stats
      const stats = {
        total: tasks.length,
        completed: tasks.filter(task => task.completed || task.status === 'done').length,
        pending: tasks.filter(task => !task.completed && task.status !== 'done').length,
        overdue: tasks.filter(task => {
          if (task.completed || task.status === 'done') return false;
          if (!task.dueDate) return false;
          return new Date(task.dueDate) < new Date();
        }).length,
        byStatus: {
          backlog: tasks.filter(task => !task.status || task.status === 'backlog').length,
          todo: tasks.filter(task => task.status === 'todo').length,
          'in-progress': tasks.filter(task => task.status === 'in-progress').length,
          review: tasks.filter(task => task.status === 'review').length,
          done: tasks.filter(task => task.status === 'done' || task.completed).length
        },
        byPriority: {
          high: tasks.filter(task => task.priority === 'high').length,
          medium: tasks.filter(task => task.priority === 'medium').length,
          low: tasks.filter(task => task.priority === 'low').length
        },
        completionRate: tasks.length > 0 ? Math.round((tasks.filter(task => task.completed || task.status === 'done').length / tasks.length) * 100) : 0,
        recentlyCompleted: tasks
          .filter(task => task.completed || task.status === 'done')
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 5)
      };
      
      setTaskStats(stats);
    } catch (error) {
      console.error('Error fetching task stats:', error);
      toast.error('Failed to load task statistics');
    } finally {
      setStatsLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
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

  const validateProfile = () => {
    const newErrors = {};
    
    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (profileData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    return newErrors;
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateProfile();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    const result = await updateProfile(profileData);
    
    if (result.success) {
      setIsEditing(false);
    } else {
      setErrors({ submit: result.error });
    }
    
    setLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validatePassword();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setPasswordLoading(true);
    setErrors({});

    const result = await changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
    
    if (result.success) {
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setErrors({ password: result.error });
    }
    
    setPasswordLoading(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileData({
      name: user?.name || '',
      email: user?.email || ''
    });
    setErrors({});
  };

  const handleCancelPassword = () => {
    setShowPasswordForm(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setErrors({});
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const StatCard = ({ icon: Icon, title, value, color, description, className = "" }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 ${className}`}>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
          <Icon size={20} className="sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            {statsLoading ? '...' : value}
          </h3>
          <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
            {title}
          </p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const ProgressBar = ({ label, value, total, color }) => {
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400 capitalize">{label.replace('-', ' ')}</span>
          <span className="text-gray-900 dark:text-gray-100 font-medium">{value} ({percentage}%)</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${color} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Profile Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
            Manage your account and track your productivity
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <StatCard
            icon={Target}
            title="Total Tasks"
            value={taskStats.total}
            color="bg-blue-600"
            description="All time tasks created"
          />
          <StatCard
            icon={CheckCircle}
            title="Completed"
            value={taskStats.completed}
            color="bg-green-600"
            description="Successfully finished"
          />
          <StatCard
            icon={Clock}
            title="Pending"
            value={taskStats.pending}
            color="bg-amber-600"
            description="Still in progress"
          />
          <StatCard
            icon={AlertTriangle}
            title="Overdue"
            value={taskStats.overdue}
            color="bg-red-600"
            description="Past due date"
          />
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Completion Rate & Status Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-purple-600 flex items-center justify-center">
                <BarChart3 size={20} className="sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Task Progress
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {taskStats.completionRate}% completion rate
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <ProgressBar 
                label="backlog" 
                value={taskStats.byStatus.backlog} 
                total={taskStats.total} 
                color="bg-gray-500" 
              />
              <ProgressBar 
                label="todo" 
                value={taskStats.byStatus.todo} 
                total={taskStats.total} 
                color="bg-slate-500" 
              />
              <ProgressBar 
                label="in-progress" 
                value={taskStats.byStatus['in-progress']} 
                total={taskStats.total} 
                color="bg-blue-500" 
              />
              <ProgressBar 
                label="review" 
                value={taskStats.byStatus.review} 
                total={taskStats.total} 
                color="bg-amber-500" 
              />
              <ProgressBar 
                label="done" 
                value={taskStats.byStatus.done} 
                total={taskStats.total} 
                color="bg-green-500" 
              />
            </div>
          </div>

          {/* Priority Breakdown & Recent Activity */}
          <div className="space-y-6">
            {/* Priority Breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-orange-600 flex items-center justify-center">
                  <TrendingUp size={20} className="sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Priority Distribution
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Task priority breakdown
                  </p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <ProgressBar 
                  label="high priority" 
                  value={taskStats.byPriority.high} 
                  total={taskStats.total} 
                  color="bg-red-500" 
                />
                <ProgressBar 
                  label="medium priority" 
                  value={taskStats.byPriority.medium} 
                  total={taskStats.total} 
                  color="bg-amber-500" 
                />
                <ProgressBar 
                  label="low priority" 
                  value={taskStats.byPriority.low} 
                  total={taskStats.total} 
                  color="bg-green-500" 
                />
              </div>
            </div>

            {/* Recent Completions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Recent Completions
              </h3>
              
              {taskStats.recentlyCompleted.length > 0 ? (
                <div className="space-y-2 sm:space-y-3">
                  {taskStats.recentlyCompleted.map((task, index) => (
                    <div key={task._id} className="flex items-center gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={14} className="text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(task.updatedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === 'high' 
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                          : task.priority === 'medium'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {task.priority}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <CheckCircle size={24} className="sm:w-8 sm:h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                    No completed tasks yet
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Start completing tasks to see them here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          {/* Profile Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl sm:text-2xl font-bold text-white">
                  {getUserInitials(user?.name)}
                </span>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {user?.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{user?.email}</p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-4 sm:p-6">
            {!isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex items-center gap-3">
                    <User size={20} className="text-gray-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                        Full Name
                      </label>
                      <p className="text-gray-900 dark:text-gray-100 font-medium truncate">
                        {user?.name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail size={20} className="text-gray-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                        Email Address
                      </label>
                      <p className="text-gray-900 dark:text-gray-100 font-medium truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button onClick={() => setIsEditing(true)} className="flex items-center justify-center gap-2">
                    <Edit size={16} />
                    Edit Profile
                  </Button>
                  
                  <Button variant="outline" onClick={() => setShowPasswordForm(true)} className="flex items-center justify-center gap-2">
                    Change Password
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    error={errors.name}
                    disabled={loading}
                  />
                  
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    error={errors.email}
                    disabled={loading}
                  />
                </div>
                
                {errors.submit && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                    {errors.submit}
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button type="submit" disabled={loading} className="flex items-center justify-center gap-2">
                    {loading ? <ButtonLoading /> : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}
                  </Button>
                  
                  <Button type="button" variant="secondary" onClick={handleCancelEdit} disabled={loading} className="flex items-center justify-center gap-2">
                    <X size={16} />
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Password Change Form */}
        {showPasswordForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                Change Password
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Enter your current password and choose a new one
              </p>
            </div>
            
            <div className="p-4 sm:p-6">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    label="Current Password"
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    error={errors.currentPassword}
                    disabled={passwordLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                <div className="relative">
                  <Input
                    label="New Password"
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    error={errors.newPassword}
                    disabled={passwordLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                <div className="relative">
                  <Input
                    label="Confirm New Password"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    error={errors.confirmPassword}
                    disabled={passwordLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                {errors.password && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                    {errors.password}
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button type="submit" disabled={passwordLoading} className="flex items-center justify-center gap-2">
                    {passwordLoading ? <ButtonLoading /> : 'Change Password'}
                  </Button>
                  
                  <Button type="button" variant="secondary" onClick={handleCancelPassword} disabled={passwordLoading}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;