import { useTheme } from '../../context/ThemeContext.jsx';
import { motion } from 'framer-motion';

export default function Select({ className = '', children, whileFocus = { scale: 1.02 }, ...props }) {
  const { theme } = useTheme();
  
  const inputBg = theme === 'dark' 
    ? 'bg-slate-800/50 text-white border-slate-700/50' 
    : 'bg-white text-slate-900 border-slate-200';

  return (
    <motion.select
      className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none ${inputBg} ${className}`}
      whileFocus={whileFocus}
      transition={{ type: 'spring', stiffness: 300 }}
      {...props}
    >
      {children}
    </motion.select>
  );
}