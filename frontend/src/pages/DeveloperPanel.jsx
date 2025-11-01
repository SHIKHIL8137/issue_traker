import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import ConfirmationModal from '../components/ui/ConfirmationModal.jsx';
import Loader from '../components/ui/Loader.jsx';
import { motion } from 'framer-motion';

export default function DeveloperPanel() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(''); // 'accept' or 'reject'
  const [selectedIssue, setSelectedIssue] = useState(null);

  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';

  const load = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const data = await api.listIssues({ assignee: user._id });
      setIssues(data.issues || data);
    } catch (error) {
      console.error('Error loading issues:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [user?._id]);

  const handleAssignmentAction = (issue, action) => {
    setSelectedIssue(issue);
    setModalAction(action);
    setIsModalOpen(true);
  };

  const confirmAssignmentAction = async () => {
    try {
      if (modalAction === 'accept' && selectedIssue) {
        await api.acceptAssignment(selectedIssue._id);
      } else if (modalAction === 'reject' && selectedIssue) {
        await api.rejectAssignment(selectedIssue._id);
      }
      await load();
    } catch (error) {
      console.error('Error updating assignment:', error);
    } finally {
      setIsModalOpen(false);
      setSelectedIssue(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
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
      <SectionHeader title="My Assigned Issues" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {issues.map((i) => (
          <motion.div
            key={i._id}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-5 rounded-2xl shadow-lg border">
              <Link to={`/issues/${i._id}`} className="block">
                <div className={`font-bold ${textClass} text-lg mb-2`}>{i.title}</div>
                <div className={`text-sm ${textSecondary} mb-4 line-clamp-2`}>{i.description}</div>
              </Link>
              
              {/* Assignment Status */}
              {i.assignmentStatus && (
                <div className="mb-3">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    i.assignmentStatus === 'Accepted' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : i.assignmentStatus === 'Rejected'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  }`}>
                    Assignment: {i.assignmentStatus}
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <div className={`text-xs ${textSecondary}`}>
                  Priority: <span className="font-medium">{i.priority}</span>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full ${
                  i.status === 'Open' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                    : i.status === 'In-Progress' 
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' 
                      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                }`}>
                  {i.status}
                </span>
              </div>
              
              {/* Assignment Actions - Show for pending assignments */}
              {i.assignmentStatus === 'Pending' && (
                <div className="flex gap-2 mb-4">
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => handleAssignmentAction(i, 'accept')}
                  >
                    Accept
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleAssignmentAction(i, 'reject')}
                  >
                    Reject
                  </Button>
                </div>
              )}
              
              {/* Status Update Actions - Removed from card, only available in issue details */}
              {i.assignmentStatus === 'Accepted' && (
                <div className="flex gap-2">
                  <Link to={`/issues/${i._id}`}>
                    <Button 
                      variant="primary" 
                      size="sm"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
        
        {issues.length === 0 && (
          <div className={`col-span-full text-center py-12 ${textSecondary}`}>
            <p>No assigned issues found</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmAssignmentAction}
        title={modalAction === 'accept' ? 'Accept Assignment' : 'Reject Assignment'}
        message={
          modalAction === 'accept' 
            ? `Are you sure you want to accept this assignment?` 
            : `Are you sure you want to reject this assignment? The issue will be unassigned and returned to the admin.`
        }
        confirmText="Confirm"
        cancelText="Cancel"
      />
    </motion.div>
  );
}