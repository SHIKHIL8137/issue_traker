import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { motion } from 'framer-motion';
import Loader from '../components/ui/Loader.jsx';
import ErrorDisplay from '../components/ui/ErrorDisplay.jsx';
import { validateForm, validateField } from '../utils/validation.js';
import { Mail, Lock, User, Building, LogIn } from 'lucide-react';

export default function Signup() {
  const { signup, user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('User');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const validate = () => {
    const formFields = { name, email, password, confirmPassword, role };
    const validationRules = {
      name: 'name',
      email: 'email',
      password: 'password',
      confirmPassword: 'confirmPassword',
      role: 'role'
    };
    
    const validationErrors = validateForm(formFields, validationRules);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleFieldBlur = (fieldName, value, allFields = {}) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, value, allFields);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const handleFieldFocus = (fieldName) => {
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
    }
  };

  const handleFieldChange = (fieldName, value) => {
    switch (fieldName) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        if (touched.confirmPassword) {
          const confirmError = validateField('confirmPassword', confirmPassword, { password: value });
          setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
        }
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      case 'role':
        setRole(value);
        break;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      role: true
    });
    
    setServerError('');
    
    if (!validate()) {
      return;
    }
    
    setSubmitting(true);
    try {
      await signup(name, email, password, role);
    } catch (err) {
      setServerError(err.message || 'Failed to create account');
    } finally {
      setSubmitting(false);
    }
  };

  const cardBg =
    theme === 'dark'
      ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl'
      : 'bg-white/90 backdrop-blur-xl';

  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  const borderClass = theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200';
  const inputBg =
    theme === 'dark'
      ? 'bg-slate-800/50 text-white border-slate-700/50'
      : 'bg-white text-slate-900 border-slate-200';

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-700 relative overflow-hidden flex items-center justify-center p-6`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className={`absolute w-96 h-96 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-400/20'
          }`}
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className={`absolute w-96 h-96 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-400/20'
          }`}
          animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          style={{ bottom: '10%', right: '10%' }}
        />
      </div>

      <motion.div
        className={`w-full max-w-md ${cardBg} rounded-3xl border ${borderClass} shadow-2xl p-8 relative z-10`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h1
            className={`text-4xl font-extrabold ${textClass} mb-2 bg-clip-text text-transparent bg-gradient-to-r ${
              theme === 'dark'
                ? 'from-blue-400 via-purple-400 to-pink-400'
                : 'from-blue-600 via-purple-600 to-pink-600'
            }`}
          >
            Create Account
          </h1>
          <p className={textSecondary}>Sign up to get started</p>
        </div>

        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <ErrorDisplay error={serverError} />
          </motion.div>
        )}

        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <label className={`block text-sm font-semibold ${textClass} mb-2`}>
              Full Name
            </label>
            <div className="relative">
              <User
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${textSecondary}`}
              />
              <motion.input
                type="text"
                value={name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                onBlur={(e) => handleFieldBlur('name', e.target.value)}
                onFocus={() => handleFieldFocus('name')}
                placeholder="Enter your full name"
                className={`w-full ${inputBg} pl-12 pr-4 py-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  (touched.name && errors.name) ? 'border-red-500' : ''
                }`}
                whileFocus={{ scale: 1.02 }}
              />
            </div>
            {touched.name && errors.name && <div className="mt-2"><ErrorDisplay error={errors.name} /></div>}
          </div>

          <div>
            <label className={`block text-sm font-semibold ${textClass} mb-2`}>
              Email Address
            </label>
            <div className="relative">
              <Mail
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${textSecondary}`}
              />
              <motion.input
                type="email"
                value={email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                onBlur={(e) => handleFieldBlur('email', e.target.value)}
                onFocus={() => handleFieldFocus('email')}
                placeholder="Enter your email"
                className={`w-full ${inputBg} pl-12 pr-4 py-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  (touched.email && errors.email) ? 'border-red-500' : ''
                }`}
                whileFocus={{ scale: 1.02 }}
              />
            </div>
            {touched.email && errors.email && <div className="mt-2"><ErrorDisplay error={errors.email} /></div>}
          </div>

          <div>
            <label className={`block text-sm font-semibold ${textClass} mb-2`}>
              Password
            </label>
            <div className="relative">
              <Lock
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${textSecondary}`}
              />
              <motion.input
                type="password"
                value={password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                onBlur={(e) => handleFieldBlur('password', e.target.value)}
                onFocus={() => handleFieldFocus('password')}
                placeholder="Create a password"
                className={`w-full ${inputBg} pl-12 pr-4 py-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  (touched.password && errors.password) ? 'border-red-500' : ''
                }`}
                whileFocus={{ scale: 1.02 }}
              />
            </div>
            {touched.password && errors.password && <div className="mt-2"><ErrorDisplay error={errors.password} /></div>}
          </div>

          <div>
            <label className={`block text-sm font-semibold ${textClass} mb-2`}>
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${textSecondary}`}
              />
              <motion.input
                type="password"
                value={confirmPassword}
                onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                onBlur={(e) => handleFieldBlur('confirmPassword', e.target.value, { password })}
                onFocus={() => handleFieldFocus('confirmPassword')}
                placeholder="Confirm your password"
                className={`w-full ${inputBg} pl-12 pr-4 py-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  (touched.confirmPassword && errors.confirmPassword) ? 'border-red-500' : ''
                }`}
                whileFocus={{ scale: 1.02 }}
              />
            </div>
            {touched.confirmPassword && errors.confirmPassword && <div className="mt-2"><ErrorDisplay error={errors.confirmPassword} /></div>}
          </div>

          <div>
            <label className={`block text-sm font-semibold ${textClass} mb-2`}>
              Role
            </label>
            <div className="relative">
              <Building
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${textSecondary}`}
              />
              <select
                value={role}
                onChange={(e) => handleFieldChange('role', e.target.value)}
                onBlur={(e) => handleFieldBlur('role', e.target.value)}
                onFocus={() => handleFieldFocus('role')}
                className={`w-full ${inputBg} pl-12 pr-4 py-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none transition-all ${
                  (touched.role && errors.role) ? 'border-red-500' : ''
                }`}
              >
                <option value="User" className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>User</option>
                <option value="Developer" className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>Developer</option>
              </select>
            </div>
            {touched.role && errors.role && <div className="mt-2"><ErrorDisplay error={errors.role} /></div>}
          </div>

          <motion.button
            type="submit"
            disabled={submitting}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 ${
              submitting
                ? 'bg-slate-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-purple-500/30'
            }`}
            whileHover={!submitting ? { scale: 1.02, y: -2 } : {}}
            whileTap={!submitting ? { scale: 0.98 } : {}}
          >
            {submitting ? (
              <>
                <Loader size="sm" />
                Creating Account...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign Up
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}