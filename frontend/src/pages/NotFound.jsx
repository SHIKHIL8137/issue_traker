import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import Button from '../components/ui/Button.jsx';
import { motion } from 'framer-motion';

export default function NotFound() {
  const { theme } = useTheme();
  
  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        <h1 className={`text-9xl font-extrabold ${textClass} mb-4 bg-clip-text text-transparent bg-gradient-to-r ${
          theme === 'dark'
            ? 'from-blue-400 via-purple-400 to-pink-400'
            : 'from-blue-600 via-purple-600 to-pink-600'
        }`}>
          404
        </h1>
      </motion.div>
      
      <motion.h2 
        className={`text-3xl font-bold ${textClass} mb-4`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Page Not Found
      </motion.h2>
      
      <motion.p 
        className={`text-lg ${textSecondary} mb-8 max-w-md`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        Sorry, the page you're looking for doesn't exist or has been moved.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Link to="/">
          <Button className="px-6 py-3 text-lg">
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}