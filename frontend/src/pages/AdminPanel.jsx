import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import api from '../services/api.js';
import IssueCard from '../components/IssueCard.jsx';
import Card from '../components/ui/Card.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import Button from '../components/ui/Button.jsx';
import ConfirmationModal from '../components/ui/ConfirmationModal.jsx';
import { motion } from 'framer-motion';

export default function AdminPanel() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('all');
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [developers, setDevelopers] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedDeveloper, setSelectedDeveloper] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(''); // 'assign' or 'unassign'

  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';

  const loadIssues = async (filter = {}) => {
    setLoading(true);
    try {
      const data = await api.listIssues(filter);
      setIssues(data.issues || data);
    } catch (error) {
      console.error('Error loading issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDevelopers = async () => {
    try {
      const userData = await api.listUsers();
      const allUsers = userData.users || userData;
      const devUsers = allUsers.filter(user => user.role === 'Developer');
      setDevelopers(devUsers);
    } catch (error) {
      console.error('Error loading developers:', error);
    }
  };

  useEffect(() => {
    switch (activeTab) {
      case 'all':
        loadIssues();
        break;
      case 'assigned':
        loadIssues({ assignee: 'exists' });
        break;
      case 'unassigned':
        loadIssues({ assignee: 'null' });
        break;
      default:
        loadIssues();
    }
    loadDevelopers();
  }, [activeTab]);

  const refreshIssues = () => {
    switch (activeTab) {
      case 'all':
        loadIssues();
        break;
      case 'assigned':
        loadIssues({ assignee: 'exists' });
        break;
      case 'unassigned':
        loadIssues({ assignee: 'null' });
        break;
      default:
        loadIssues();
    }
  };

  const handleAssignClick = (issue, developerId) => {
    setSelectedIssue(issue);
    setSelectedDeveloper(developerId);
    setModalAction('assign');
    setIsModalOpen(true);
  };

  const handleUnassignClick = (issue) => {
    setSelectedIssue(issue);
    setModalAction('unassign');
    setIsModalOpen(true);
  };

  const confirmAssignment = async () => {
    try {
      if (modalAction === 'assign' && selectedIssue && selectedDeveloper) {
        await api.assignIssue(selectedIssue._id, selectedDeveloper);
      } else if (modalAction === 'unassign' && selectedIssue) {
        await api.assignIssue(selectedIssue._id, null);
      }
      // Refresh the issues list
      refreshIssues();
    } catch (error) {
      console.error('Error updating assignment:', error);
    } finally {
      setIsModalOpen(false);
      setSelectedIssue(null);
      setSelectedDeveloper('');
    }
  };

  return (
    <motion.div 
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SectionHeader 
        title="Issue Management" 
        action={
          <Button onClick={refreshIssues} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        }
      />
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'all'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : `${textSecondary} hover:text-gray-700 dark:hover:text-gray-300`
          }`}
          onClick={() => setActiveTab('all')}
        >
          All Issues
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'assigned'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : `${textSecondary} hover:text-gray-700 dark:hover:text-gray-300`
          }`}
          onClick={() => setActiveTab('assigned')}
        >
          Assigned to Developers
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'unassigned'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : `${textSecondary} hover:text-gray-700 dark:hover:text-gray-300`
          }`}
          onClick={() => setActiveTab('unassigned')}
        >
          Unassigned Issues
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Issues Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {issues.map((i) => (
            <IssueCard key={i._id} issue={i}>
              {/* Assignment Controls for Each Issue */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={i.assignee?._id || ''}
                    onChange={(e) => handleAssignClick(i, e.target.value)}
                    className={`flex-1 min-w-[150px] px-2 py-1 rounded text-sm ${
                      theme === 'dark' 
                        ? 'bg-slate-800 border-slate-700 text-white' 
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="">Unassigned</option>
                    {developers.map((dev) => (
                      <option key={dev._id} value={dev._id}>
                        {dev.name}
                      </option>
                    ))}
                  </select>
                  {i.assignee && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleUnassignClick(i)}
                    >
                      Unassign
                    </Button>
                  )}
                </div>
              </div>
            </IssueCard>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && issues.length === 0 && (
        <Card className="p-8 text-center rounded-2xl border">
          <div className="text-5xl mb-4">📋</div>
          <h3 className={`text-xl font-semibold mb-2 ${textClass}`}>
            {activeTab === 'all' && 'No issues found'}
            {activeTab === 'assigned' && 'No assigned issues found'}
            {activeTab === 'unassigned' && 'No unassigned issues found'}
          </h3>
          <p className={textSecondary}>
            {activeTab === 'all' && 'There are currently no issues in the system.'}
            {activeTab === 'assigned' && 'There are currently no issues assigned to developers.'}
            {activeTab === 'unassigned' && 'There are currently no unassigned issues.'}
          </p>
        </Card>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmAssignment}
        title={modalAction === 'assign' ? 'Assign Issue' : 'Unassign Issue'}
        message={
          modalAction === 'assign' 
            ? `Are you sure you want to assign this issue to the selected developer?` 
            : `Are you sure you want to unassign this issue?`
        }
        confirmText="Confirm"
        cancelText="Cancel"
      />
    </motion.div>
  );
}