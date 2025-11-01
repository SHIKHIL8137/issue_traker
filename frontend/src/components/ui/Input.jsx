import { useTheme } from '../../context/ThemeContext.jsx';
import { motion } from 'framer-motion';

export default function Input({ className = '', whileFocus = { scale: 1.02 }, ...props }) {
  const { theme } = useTheme();
  
  const inputBg = theme === 'dark' 
    ? 'bg-slate-800/50 text-white border-slate-700/50' 
    : 'bg-white text-slate-900 border-slate-200';
    
  const placeholderClass = theme === 'dark' 
    ? 'placeholder:text-slate-500' 
    : 'placeholder:text-slate-400';

  return (
    <motion.input
      className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${inputBg} ${placeholderClass} ${className}`}
      whileFocus={whileFocus}
      transition={{ type: 'spring', stiffness: 300 }}
      {...props}
    />
  );
}