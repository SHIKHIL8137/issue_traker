import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import Loader from '../components/ui/Loader.jsx';
import ErrorDisplay from '../components/ui/ErrorDisplay.jsx';
import { validateForm, validateField } from '../utils/validation.js';
import { Mail, Lock, Eye, EyeOff, LogIn, Sun, Moon, Sparkles } from 'lucide-react';

export default function Login() {
  const { login, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const dest = location.state?.from?.pathname || '/';
      navigate(dest, { replace: true });
    }
  }, [user, navigate, location]);

  // GSAP entry animation
  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }
    );
  }, []);

  const validate = () => {
    const formFields = { email, password };
    const validationRules = {
      email: 'email',
      password: 'password'
    };
    
    const validationErrors = validateForm(formFields, validationRules);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleFieldBlur = (fieldName, value) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, value);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const handleFieldFocus = (fieldName) => {
    // Clear error when user focuses on the field
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
    }
  };

  const handleFieldChange = (fieldName, value) => {
    // Update the field value
    if (fieldName === 'email') {
      setEmail(value);
    } else if (fieldName === 'password') {
      setPassword(value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      email: true,
      password: true
    });
    
    // Clear previous errors
    setServerError('');
    
    // Validate form
    if (!validate()) {
      return;
    }
    
    setSubmitting(true);
    try {
      await login(email, password);
      // Redirect handled by useEffect above
    } catch (err) {
      setServerError(err.message || 'Login failed');
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

  // Don't show login form if already logged in
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-all duration-700 relative overflow-hidden flex items-center justify-center p-6`}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className={`absolute w-96 h-96 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-400/20'
          }`}
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ top: '10%', left: '10%', zIndex: 0 }}
        />
        <motion.div
          className={`absolute w-96 h-96 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-400/20'
          }`}
          animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          style={{ bottom: '10%', right: '10%', zIndex: 0 }}
        />
      </div>

      {/* Login Form */}
      <motion.div
        ref={formRef}
        className={`w-full max-w-md ${cardBg} rounded-3xl border ${borderClass} shadow-2xl p-8 relative z-10`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className={`text-4xl font-extrabold ${textClass} mb-2 bg-clip-text text-transparent bg-gradient-to-r ${
              theme === 'dark'
                ? 'from-blue-400 via-purple-400 to-pink-400'
                : 'from-blue-600 via-purple-600 to-pink-600'
            }`}
          >
            Welcome Back
          </h1>
          <p className={textSecondary}>Sign in to your account to continue</p>
        </div>

        {/* Error Message */}
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <ErrorDisplay error={serverError} />
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Email */}
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

          {/* Password */}
          <div>
            <label className={`block text-sm font-semibold ${textClass} mb-2`}>
              Password
            </label>
            <div className="relative">
              <Lock
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${textSecondary}`}
              />
              <motion.input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                onBlur={(e) => handleFieldBlur('password', e.target.value)}
                onFocus={() => handleFieldFocus('password')}
                placeholder="Enter your password"
                className={`w-full ${inputBg} pl-12 pr-12 py-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  (touched.password && errors.password) ? 'border-red-500' : ''
                }`}
                whileFocus={{ scale: 1.02 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${textSecondary} hover:${textClass} transition-colors`}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {touched.password && errors.password && <div className="mt-2"><ErrorDisplay error={errors.password} /></div>}
          </div>

          {/* Submit */}
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
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}