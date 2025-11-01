import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Building, LogIn } from 'lucide-react';

export default function Signup() {
  const { signup, user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signup(name, email, password, role);
      // Redirect handled by useEffect above
    } catch (err) {
      setError(err.message);
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

  // Don't show signup form if already logged in
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-700 relative overflow-hidden flex items-center justify-center p-6`}>
      {/* Animated background */}
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
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 mb-4 shadow-lg shadow-purple-500/30"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <User className="w-8 h-8 text-white" />
          </motion.div>
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

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/50 text-red-400"
          >
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}

        <form className="space-y-5" onSubmit={onSubmit}>
          {/* Name */}
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
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className={`w-full ${inputBg} pl-12 pr-4 py-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                whileFocus={{ scale: 1.02 }}
              />
            </div>
          </div>

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
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className={`w-full ${inputBg} pl-12 pr-4 py-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                whileFocus={{ scale: 1.02 }}
              />
            </div>
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                className={`w-full ${inputBg} pl-12 pr-4 py-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                whileFocus={{ scale: 1.02 }}
              />
            </div>
          </div>

          {/* Role */}
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
                onChange={(e) => setRole(e.target.value)}
                className={`w-full ${inputBg} pl-12 pr-4 py-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none transition-all`}
              >
                <option value="User" className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>User</option>
                <option value="Developer" className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>Developer</option>
              </select>
            </div>
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
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
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