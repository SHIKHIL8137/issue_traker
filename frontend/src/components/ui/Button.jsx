import { useTheme } from '../../context/ThemeContext.jsx';
import { motion } from 'framer-motion';

export default function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  whileHover = { scale: 1.03, y: -2 },
  whileTap = { scale: 0.98 },
  ...props 
}) {
  const { theme } = useTheme();
  
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none shadow-lg';
  
  const variants = {
    primary: theme === 'dark' 
      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white focus:ring-purple-500 shadow-purple-500/30' 
      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white focus:ring-purple-500 shadow-purple-500/30',
    secondary: theme === 'dark' 
      ? 'bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white focus:ring-slate-500' 
      : 'bg-gradient-to-r from-slate-200 to-slate-300 hover:from-slate-300 hover:to-slate-400 text-slate-900 focus:ring-slate-500',
    outline: theme === 'dark' 
      ? 'border border-slate-700 hover:bg-slate-800 text-white' 
      : 'border border-slate-300 hover:bg-slate-50 text-slate-900',
    ghost: theme === 'dark' 
      ? 'hover:bg-slate-800 text-white' 
      : 'hover:bg-slate-100 text-slate-900'
  };
  
  return (
    <motion.button 
      className={`${base} ${variants[variant] || variants.primary} ${className}`} 
      whileHover={whileHover}
      whileTap={whileTap}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}