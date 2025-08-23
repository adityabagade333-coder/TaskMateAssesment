// Token validation
export const isValidToken = (token) => {
  if (!token) return false;
  
  try {
    // Decode JWT token (without verification - just for expiry check)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    return payload.exp > currentTime;
  } catch (error) {
    console.error('Invalid token format:', error);
    return false;
  }
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Set token in localStorage
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Get user from localStorage
export const getUser = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

// Set user in localStorage
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Remove user from localStorage
export const removeUser = () => {
  localStorage.removeItem('user');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  return token && isValidToken(token);
};

// Clear all auth data
export const clearAuthData = () => {
  removeToken();
  removeUser();
};

// Form validation helpers
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 50;
};

// Form validation for registration
export const validateRegisterForm = (formData) => {
  const errors = {};

  if (!validateName(formData.name)) {
    errors.name = 'Name must be between 2 and 50 characters';
  }

  if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!validatePassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Form validation for login
export const validateLoginForm = (formData) => {
  const errors = {};

  if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Format user display name
export const formatUserName = (user) => {
  if (!user || !user.name) return 'User';
  return user.name.charAt(0).toUpperCase() + user.name.slice(1);
};

// Get user initials for avatar
export const getUserInitials = (user) => {
  if (!user || !user.name) return 'U';
  
  const names = user.name.trim().split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

// Check if password meets requirements
export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, message: 'Password is required' };
  
  let strength = 0;
  const checks = {
    length: password.length >= 6,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  strength += checks.length ? 1 : 0;
  strength += checks.lowercase ? 1 : 0;
  strength += checks.uppercase ? 1 : 0;
  strength += checks.numbers ? 1 : 0;
  strength += checks.symbols ? 1 : 0;

  let message = '';
  if (strength <= 2) {
    message = 'Weak password';
  } else if (strength <= 3) {
    message = 'Fair password';
  } else if (strength <= 4) {
    message = 'Good password';
  } else {
    message = 'Strong password';
  }

  return {
    strength: (strength / 5) * 100,
    message,
    checks,
  };
};

// Handle auth errors
export const getAuthErrorMessage = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    if (status === 400) {
      return data.message || 'Invalid input data';
    } else if (status === 401) {
      return 'Invalid email or password';
    } else if (status === 409) {
      return 'User already exists with this email';
    } else if (status === 429) {
      return 'Too many attempts. Please try again later';
    } else if (status >= 500) {
      return 'Server error. Please try again later';
    }
    
    return data.message || 'Authentication failed';
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your connection';
  } else {
    // Other error
    return error.message || 'An unexpected error occurred';
  }
};

// Auto-logout timer
let logoutTimer = null;

export const startLogoutTimer = (expirationTime) => {
  if (logoutTimer) {
    clearTimeout(logoutTimer);
  }
  
  const remainingTime = expirationTime - Date.now();
  
  if (remainingTime > 0) {
    logoutTimer = setTimeout(() => {
      clearAuthData();
      window.location.href = '/login';
    }, remainingTime);
  }
};

export const clearLogoutTimer = () => {
  if (logoutTimer) {
    clearTimeout(logoutTimer);
    logoutTimer = null;
  }
};