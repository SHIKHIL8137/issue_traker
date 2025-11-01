import { useTheme } from '../../context/ThemeContext.jsx';
import { motion } from 'framer-motion';

export default function Card({ className = '', children, hoverEffect = true, ...props }) {
  const { theme } = useTheme();
  
  const cardBg = theme === 'dark' 
    ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl' 
    : 'bg-white/90 backdrop-blur-xl';
    
  const borderClass = theme === 'dark' 
    ? 'border-slate-700/50' 
    : 'border-slate-200';

  const cardClasses = `${cardBg} rounded-2xl border ${borderClass} shadow-xl ${className}`;

  if (hoverEffect) {
    return (
      <motion.div
        className={cardClasses}
        whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
        transition={{ type: 'spring', stiffness: 300 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
}