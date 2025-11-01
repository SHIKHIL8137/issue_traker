
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import RoleDashboard from '../components/RoleDashboard.jsx';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();

  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';

  return (
    <motion.div 
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className={`text-3xl font-extrabold ${textClass} mb-2 bg-clip-text text-transparent bg-gradient-to-r ${
        theme === 'dark'
          ? 'from-blue-400 via-purple-400 to-pink-400'
          : 'from-blue-600 via-purple-600 to-pink-600'
      }`}>
        Dashboard
      </h1>
      
      <RoleDashboard />
    </motion.div>
  );
}