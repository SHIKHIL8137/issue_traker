export const validateName = (name) => {
  if (!name || name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }
  if (name.trim().length > 50) {
    return 'Name must be less than 50 characters';
  }
  return null;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'Email is required';
  }
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};

export const validateRole = (role) => {
  const validRoles = ['User', 'Developer'];
  if (!validRoles.includes(role)) {
    return 'Please select a valid role';
  }
  return null;
};

export const validateForm = (fields, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = fields[field];
    const rule = rules[field];
    
    if (rule === 'name') {
      errors[field] = validateName(value);
    } else if (rule === 'email') {
      errors[field] = validateEmail(value);
    } else if (rule === 'password') {
      errors[field] = validatePassword(value);
    } else if (rule === 'confirmPassword') {
      errors[field] = validateConfirmPassword(fields.password, value);
    } else if (rule === 'role') {
      errors[field] = validateRole(value);
    }
  });
  
  Object.keys(errors).forEach(key => {
    if (!errors[key]) {
      delete errors[key];
    }
  });
  
  return errors;
};

export const validateField = (fieldName, value, fields = {}) => {
  switch (fieldName) {
    case 'name':
      return validateName(value);
    case 'email':
      return validateEmail(value);
    case 'password':
      return validatePassword(value);
    case 'confirmPassword':
      return validateConfirmPassword(fields.password || '', value);
    case 'role':
      return validateRole(value);
    case 'title':
      if (!value || value.trim().length < 3) {
        return 'Title must be at least 3 characters long';
      }
      return null;
    case 'description':
      if (!value || value.trim().length < 10) {
        return 'Description must be at least 10 characters long';
      }
      if (value.trim().length > 1000) {
        return 'Description must be less than 1000 characters';
      }
      return null;
    case 'priority':
      if (!value) {
        return 'Please select a priority';
      }
      return null;
    case 'comment':
      if (!value || value.trim().length < 1) {
        return 'Comment cannot be empty';
      }
      if (value.trim().length > 500) {
        return 'Comment must be less than 500 characters';
      }
      return null;
    default:
      return null;
  }
};