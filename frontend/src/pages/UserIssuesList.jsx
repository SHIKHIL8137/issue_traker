import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import api from '../services/api.js';
import IssueCard from '../components/IssueCard.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import Loader from '../components/ui/Loader.jsx';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

export default function UserIssuesList() {
  const { theme } = useTheme();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load issues reported by the current user
      const data = await api.listIssues();
      setIssues(data.issues || data);
    } catch (err) {
      setError(err.message || 'Failed to load issues');
      console.error('Error loading issues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    load(); 
  }, []);

  return (
    <motion.div 
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SectionHeader 
        title="My Reported Issues" 
        subtitle="Issues you have reported"
        action={
          <button 
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-all"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        }
      />
      
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader size="lg" />
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className={`text-center py-8 px-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50`}>
          <p className={`text-red-700 dark:text-red-300 font-medium`}>Error: {error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={load}
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Issues Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {issues.map((i) => (
            <IssueCard key={i._id} issue={i} />
          ))}
        </div>
      )}
      
      {/* Empty State */}
      {!loading && !error && issues.length === 0 && (
        <div className={`text-center py-16 rounded-2xl border ${theme === 'dark' ? 'border-slate-700/50 bg-slate-800/50' : 'border-slate-200 bg-slate-50'} backdrop-blur-xl`}>
          <div className="text-5xl mb-4">📋</div>
          <h3 className={`text-xl font-semibold mb-2 ${textClass}`}>No reported issues</h3>
          <p className={`mb-6 max-w-md mx-auto ${textSecondary}`}>
            You haven't reported any issues yet.
          </p>
        </div>
      )}
    </motion.div>
  );
}