import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { motion } from 'framer-motion';

export default function UserPanel() {
  const { theme } = useTheme();

  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';

  return (
    <motion.div 
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center py-8">
        <h1 className={`text-3xl font-extrabold ${textClass} mb-4 bg-clip-text text-transparent bg-gradient-to-r ${
          theme === 'dark'
            ? 'from-blue-400 via-purple-400 to-pink-400'
            : 'from-blue-600 via-purple-600 to-pink-600'
        }`}>
          User Dashboard
        </h1>
        <p className={textSecondary}>Manage your issues and activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="p-6 rounded-2xl shadow-lg border">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-2xl text-white font-bold">📋</span>
              </div>
              <h2 className={`text-xl font-bold ${textClass}`}>My Issues</h2>
              <p className={textSecondary}>
                View and manage issues you've reported
              </p>
              <Link to="/user/issues">
                <Button>View My Issues</Button>
              </Link>
            </div>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="p-6 rounded-2xl shadow-lg border">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                <span className="text-2xl text-white font-bold">+</span>
              </div>
              <h2 className={`text-xl font-bold ${textClass}`}>Create New Issue</h2>
              <p className={textSecondary}>
                Report a new issue or feature request
              </p>
              <Link to="/issues/new">
                <Button variant="outline">Create Issue</Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>

      <Card className="p-6 rounded-2xl shadow-lg border">
        <h2 className={`text-xl font-bold ${textClass} mb-4`}>Getting Started</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">1</div>
            <p className={textSecondary}>
              <span className="font-medium">Report Issues:</span> Use the "Create New Issue" button to report bugs, request features, or ask questions.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">2</div>
            <p className={textSecondary}>
              <span className="font-medium">Track Progress:</span> Visit "My Issues" to see the status of your reported issues.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">3</div>
            <p className={textSecondary}>
              <span className="font-medium">Stay Updated:</span> Check back regularly to see comments and status updates from the team.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}