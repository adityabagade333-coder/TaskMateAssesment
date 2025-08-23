import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, apiUtils } from '../services/api';
import { isAuthenticated, clearAuthData, setToken, setUser, getUser } from '../utils/auth';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (isAuthenticated()) {
        const storedUser = getUser();
        if (storedUser) {
          setUserState(storedUser);
        } else {
          try {
            const response = await authAPI.getMe();
            setUserState(response.user);
            setUser(response.user);
          } catch (error) {
            clearAuthData();
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response;
      
      setToken(token);
      setUser(user);
      setUserState(user);
      apiUtils.setAuthToken(token);
      
      toast.success('Login successful!');
      return { success: true, user };
    } catch (error) {
      const errorData = error.response?.data;
      return { 
        success: false, 
        error: errorData?.errors ? errorData : (errorData?.message || 'Login failed')
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, user } = response;
      
      setToken(token);
      setUser(user);
      setUserState(user);
      apiUtils.setAuthToken(token);
      
      toast.success('Registration successful!');
      return { success: true, user };
    } catch (error) {
      const errorData = error.response?.data;
      return { 
        success: false, 
        error: errorData?.errors ? errorData : (errorData?.message || 'Registration failed')
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
      setUserState(null);
      apiUtils.clearAuth();
      toast.success('Logged out successfully');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      setUserState(response.user);
      setUser(response.user);
      toast.success('Profile updated successfully!');
      return { success: true, user: response.user };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Profile update failed' };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      await authAPI.changePassword(passwordData);
      toast.success('Password changed successfully!');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Password change failed' };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};