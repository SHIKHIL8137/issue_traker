import { useTheme } from '../../context/ThemeContext.jsx';
import { motion } from 'framer-motion';

export default function SectionHeader({ title, subtitle, action }) {
  const { theme } = useTheme();
  
  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const subtitleClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';

  return (
    <motion.div 
      className="flex flex-col gap-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-extrabold ${textClass} bg-clip-text text-transparent bg-gradient-to-r ${
          theme === 'dark'
            ? 'from-blue-400 via-purple-400 to-pink-400'
            : 'from-blue-600 via-purple-600 to-pink-600'
        }`}>
          {title}
        </h2>
        {action && (
          <div className="flex items-center gap-2">
            {action}
          </div>
        )}
      </div>
      {subtitle && (
        <p className={`text-sm ${subtitleClass}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}