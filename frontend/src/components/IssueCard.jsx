import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import { motion } from 'framer-motion';

export default function IssueCard({ issue }) {
  const { theme } = useTheme();
  
  const cardBg = theme === 'dark' 
    ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl' 
    : 'bg-white/90 backdrop-blur-xl';
    
  const borderClass = theme === 'dark' 
    ? 'border-slate-700/50' 
    : 'border-slate-200';
    
  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  const textTertiary = theme === 'dark' ? 'text-slate-500' : 'text-slate-500';

  return (
    <motion.div 
      className={`${cardBg} rounded-2xl border ${borderClass} p-5 flex flex-col gap-3 shadow-lg transition-all hover:shadow-xl`}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="flex items-start justify-between">
        <Link to={`/issues/${issue._id}`} className={`font-bold hover:underline ${textClass} text-lg`}>
          {issue.title}
        </Link>
        <span className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap ${
          issue.status === 'Open' 
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
            : issue.status === 'In-Progress' 
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' 
              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
        }`}>
          {issue.status}
        </span>
      </div>
      
      <div className={`text-sm ${textSecondary} line-clamp-2`}>
        {issue.description}
      </div>
      
      <div className="flex items-center justify-between mt-2">
        <div className={`text-xs ${textTertiary}`}>
          Priority: <span className="font-medium">{issue.priority}</span>
        </div>
        <div className={`text-xs ${textTertiary} truncate max-w-[120px]`}>
          {issue.assignee?.name || 'Unassigned'}
        </div>
      </div>
    </motion.div>
  );
}