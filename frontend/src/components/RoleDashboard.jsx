import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import api from '../services/api.js';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import { motion } from 'framer-motion';
import { 
  User, 
  Shield, 
  Settings, 
  Clipboard, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Users,
  FileText
} from 'lucide-react';

export default function RoleDashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';

  useEffect(() => {
    const loadStats = async () => {
      try {
        if (user) {
          if (user.role === 'Admin') {
            // Admin stats
            const [issues, users] = await Promise.all([
              api.listIssues(),
              api.listUsers()
            ]);
            
            const issueList = issues.issues || issues;
            const userList = users.users || users;
            
            setStats({
              totalIssues: issueList.length,
              openIssues: issueList.filter(i => i.status === 'Open').length,
              inProgressIssues: issueList.filter(i => i.status === 'In-Progress').length,
              resolvedIssues: issueList.filter(i => i.status === 'Resolved').length,
              totalUsers: userList.length,
              admins: userList.filter(u => u.role === 'Admin').length,
              developers: userList.filter(u => u.role === 'Developer').length,
              regularUsers: userList.filter(u => u.role === 'User').length
            });
          } else if (user.role === 'Developer') {
            // Developer stats
            const issues = await api.listIssues({ assignee: user._id });
            const issueList = issues.issues || issues;
            
            setStats({
              assignedIssues: issueList.length,
              openIssues: issueList.filter(i => i.status === 'Open').length,
              inProgressIssues: issueList.filter(i => i.status === 'In-Progress').length,
              resolvedIssues: issueList.filter(i => i.status === 'Resolved').length
            });
          } else if (user.role === 'User') {
            // User stats
            const issues = await api.listIssues();
            const issueList = issues.issues || issues;
            
            setStats({
              myIssues: issueList.length,
              openIssues: issueList.filter(i => i.status === 'Open').length,
              inProgressIssues: issueList.filter(i => i.status === 'In-Progress').length,
              resolvedIssues: issueList.filter(i => i.status === 'Resolved').length
            });
          }
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center py-6">
        <h1 className={`text-3xl font-extrabold ${textClass} mb-2 bg-clip-text text-transparent bg-gradient-to-r ${
          theme === 'dark'
            ? 'from-blue-400 via-purple-400 to-pink-400'
            : 'from-blue-600 via-purple-600 to-pink-600'
        }`}>
          Welcome, {user?.name}
        </h1>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          {user?.role === 'Admin' && <Shield size={16} />}
          {user?.role === 'Developer' && <Settings size={16} />}
          {user?.role === 'User' && <User size={16} />}
          <span className="font-medium">{user?.role}</span>
        </div>
      </div>

      {user?.role === 'Admin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-5 rounded-2xl shadow-lg border">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Clipboard className="text-blue-500 dark:text-blue-400" size={24} />
                </div>
                <div>
                  <p className={`text-sm ${textSecondary}`}>Total Issues</p>
                  <p className="text-2xl font-bold text-blue-500">{stats.totalIssues || 0}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-5 rounded-2xl shadow-lg border">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <Clock className="text-amber-500 dark:text-amber-400" size={24} />
                </div>
                <div>
                  <p className={`text-sm ${textSecondary}`}>Open Issues</p>
                  <p className="text-2xl font-bold text-amber-500">{stats.openIssues || 0}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-5 rounded-2xl shadow-lg border">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <TrendingUp className="text-purple-500 dark:text-purple-400" size={24} />
                </div>
                <div>
                  <p className={`text-sm ${textSecondary}`}>In Progress</p>
                  <p className="text-2xl font-bold text-purple-500">{stats.inProgressIssues || 0}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-5 rounded-2xl shadow-lg border">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="text-green-500 dark:text-green-400" size={24} />
                </div>
                <div>
                  <p className={`text-sm ${textSecondary}`}>Resolved</p>
                  <p className="text-2xl font-bold text-green-500">{stats.resolvedIssues || 0}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-5 rounded-2xl shadow-lg border">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                  <Users className="text-indigo-500 dark:text-indigo-400" size={24} />
                </div>
                <div>
                  <p className={`text-sm ${textSecondary}`}>Total Users</p>
                  <p className="text-2xl font-bold text-indigo-500">{stats.totalUsers || 0}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-5 rounded-2xl shadow-lg border">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
                  <Shield className="text-red-500 dark:text-red-400" size={24} />
                </div>
                <div>
                  <p className={`text-sm ${textSecondary}`}>Admins</p>
                  <p className="text-2xl font-bold text-red-500">{stats.admins || 0}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-5 rounded-2xl shadow-lg border">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                  <Settings className="text-cyan-500 dark:text-cyan-400" size={24} />
                </div>
                <div>
                  <p className={`text-sm ${textSecondary}`}>Developers</p>
                  <p className="text-2xl font-bold text-cyan-500">{stats.developers || 0}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-5 rounded-2xl shadow-lg border">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-teal-100 dark:bg-teal-900/30">
                  <User className="text-teal-500 dark:text-teal-400" size={24} />
                </div>
                <div>
                  <p className={`text-sm ${textSecondary}`}>Regular Users</p>
                  <p className="text-2xl font-bold text-teal-500">{stats.regularUsers || 0}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {user?.role === 'Developer' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-5 rounded-2xl shadow-lg border">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Clipboard className="text-blue-500 dark:text-blue-400" size={24} />
                </div>
                <div>
                  <p className={`text-sm ${textSecondary}`}>Assigned Issues</p>
                  <p className="text-2xl font-bold text-blue-500">{stats.assignedIssues || 0}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-5 rounded-2xl shadow-lg border">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <Clock className="text-amber-500 dark:text-amber-400" size={24} />
                </div>
                <div>
                  <p className={`text-sm ${textSecondary}`}>Open Issues</p>
                  <p className="text-2xl font-bold text-amber-500">{stats.openIssues || 0}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-5 rounded-2xl shadow-lg border">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <TrendingUp className="text-purple-500 dark:text-purple-400" size={24} />
                </div>
                <div>
                  <p className={`text-sm ${textSecondary}`}>In Progress</p>
                  <p className="text-2xl font-bold text-purple-500">{stats.inProgressIssues || 0}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-5 rounded-2xl shadow-lg border">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="text-green-500 dark:text-green-400" size={24} />
                </div>
                <div>
                  <p className={`text-sm ${textSecondary}`}>Resolved</p>
                  <p className="text-2xl font-bold text-green-500">{stats.resolvedIssues || 0}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {user?.role === 'User' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-5 rounded-2xl shadow-lg border">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <FileText className="text-blue-500 dark:text-blue-400" size={24} />
                </div>
                <div>
                  <p className={`text-sm ${textSecondary}`}>My Issues</p>
                  <p className="text-2xl font-bold text-blue-500">{stats.myIssues || 0}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-5 rounded-2xl shadow-lg border">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <Clock className="text-amber-500 dark:text-amber-400" size={24} />
                </div>
                <div>
                  <p className={`text-sm ${textSecondary}`}>Open Issues</p>
                  <p className="text-2xl font-bold text-amber-500">{stats.openIssues || 0}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-5 rounded-2xl shadow-lg border">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <TrendingUp className="text-purple-500 dark:text-purple-400" size={24} />
                </div>
                <div>
                  <p className={`text-sm ${textSecondary}`}>In Progress</p>
                  <p className="text-2xl font-bold text-purple-500">{stats.inProgressIssues || 0}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-5 rounded-2xl shadow-lg border">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="text-green-500 dark:text-green-400" size={24} />
                </div>
                <div>
                  <p className={`text-sm ${textSecondary}`}>Resolved</p>
                  <p className="text-2xl font-bold text-green-500">{stats.resolvedIssues || 0}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      <Card className="p-6 rounded-2xl shadow-lg border">
        <h2 className={`text-xl font-bold ${textClass} mb-4`}>Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {user?.role === 'Admin' && (
            <>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <Shield className="text-blue-500 dark:text-blue-400" size={20} />
                    </div>
                    <span className={textClass}>Manage Users</span>
                  </div>
                </Card>
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <Clipboard className="text-purple-500 dark:text-purple-400" size={20} />
                    </div>
                    <span className={textClass}>View All Issues</span>
                  </div>
                </Card>
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                      <CheckCircle className="text-green-500 dark:text-green-400" size={20} />
                    </div>
                    <span className={textClass}>Reports</span>
                  </div>
                </Card>
              </motion.div>
            </>
          )}
          
          {user?.role === 'Developer' && (
            <>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <Clipboard className="text-blue-500 dark:text-blue-400" size={20} />
                    </div>
                    <span className={textClass}>My Assigned Issues</span>
                  </div>
                </Card>
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <TrendingUp className="text-purple-500 dark:text-purple-400" size={20} />
                    </div>
                    <span className={textClass}>Update Status</span>
                  </div>
                </Card>
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                      <CheckCircle className="text-green-500 dark:text-green-400" size={20} />
                    </div>
                    <span className={textClass}>Resolve Issues</span>
                  </div>
                </Card>
              </motion.div>
            </>
          )}
          
          {user?.role === 'User' && (
            <>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <FileText className="text-blue-500 dark:text-blue-400" size={20} />
                    </div>
                    <span className={textClass}>My Issues</span>
                  </div>
                </Card>
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                      <Clipboard className="text-green-500 dark:text-green-400" size={20} />
                    </div>
                    <span className={textClass}>Report New Issue</span>
                  </div>
                </Card>
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <AlertCircle className="text-purple-500 dark:text-purple-400" size={20} />
                    </div>
                    <span className={textClass}>View Updates</span>
                  </div>
                </Card>
              </motion.div>
            </>
          )}
        </div>
      </Card>
    </motion.div>
  );
}