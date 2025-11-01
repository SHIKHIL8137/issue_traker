import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import api from '../services/api.js';
import CommentThread from '../components/CommentThread.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Select from '../components/ui/Select.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import ConfirmationModal from '../components/ui/ConfirmationModal.jsx';
import { motion } from 'framer-motion';

export default function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [issue, setIssue] = useState(null);
  const [users, setUsers] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [comments, setComments] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [statusPending, setStatusPending] = useState(false);
  const [assignPending, setAssignPending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('');
  const [selectedDeveloper, setSelectedDeveloper] = useState('');
  const [assignmentAction, setAssignmentAction] = useState(''); // 'assign' or 'unassign'

  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';

  const canEdit = useMemo(() => {
    // Admins and Users can edit their own issues
    // But once assigned to a developer, only admins can edit
    if (!user || !issue) return false;
    
    // Admins can always edit
    if (user.role === 'Admin') return false; // Changed to false as per requirement
    
    // Users can edit only their own unassigned issues
    if (user.role === 'User' && user._id === issue.reporter?._id) {
      return !issue.assignee; // Can't edit once assigned
    }
    
    return false;
  }, [user, issue]);

  const canAssign = user?.role === 'Admin';
  const canUpdateStatus = user?.role === 'Developer';
  const isAdmin = user?.role === 'Admin';
  const isUser = user?.role === 'User';
  const isDeveloper = user?.role === 'Developer';

  const load = async () => {
    try {
      const data = await api.getIssue(id);
      setIssue(data.issue || data);
      
      const c = await api.listComments(id);
      const list = c.comments || c;
      const mapNode = (n) => ({
        _id: n._id,
        content: n.text ?? n.content,
        user: n.user,
        createdAt: n.createdAt,
        children: (n.replies || n.children || []).map(mapNode)
      });
      setComments(Array.isArray(list) ? list.map(mapNode) : []);
      
      // Fetch audit logs only for admin users
      if (isAdmin) {
        const logs = await api.getIssueAuditLogs(id);
        setAuditLogs(Array.isArray(logs) ? logs : []);
      }
    } catch (error) {
      console.error('Error loading issue details:', error);
    }
  };

  useEffect(() => { 
    if (id) {
      load(); 
    }
  }, [id, isAdmin]);
  
  useEffect(() => { 
    if (canAssign) {
      api.listUsers().then((u) => {
        const allUsers = u.users || u;
        setUsers(allUsers);
        // Filter only developers for assignment dropdown
        setDevelopers(allUsers.filter(user => user.role === 'Developer'));
      });
    }
  }, [canAssign]);

  const onReply = async (parentId, content) => {
    try {
      const res = await api.addComment(id, content, parentId);
      setComments((prev) => [...prev, res.comment || res]);
      await load();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleStatusChange = (status) => {
    setPendingStatus(status);
    setIsModalOpen(true);
  };

  const confirmStatusChange = async () => {
    setStatusPending(true);
    try {
      await api.updateStatus(id, pendingStatus);
      await load();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setStatusPending(false);
      setIsModalOpen(false);
      setPendingStatus('');
    }
  };

  const handleAssignClick = (developerId) => {
    // Check if there's already a pending assignment
    if (issue.assignee && issue.assignmentStatus === 'Pending') {
      // Show confirmation to override existing assignment
      setSelectedDeveloper(developerId);
      setAssignmentAction('override');
      setIsModalOpen(true);
    } else {
      setSelectedDeveloper(developerId);
      setAssignmentAction('assign');
      setIsModalOpen(true);
    }
  };

  const handleUnassignClick = () => {
    setAssignmentAction('unassign');
    setIsModalOpen(true);
  };

  const confirmAssignment = async () => {
    setAssignPending(true);
    try {
      if (assignmentAction === 'assign' && selectedDeveloper) {
        await api.assignIssue(id, selectedDeveloper);
      } else if (assignmentAction === 'override' && selectedDeveloper) {
        await api.assignIssue(id, selectedDeveloper);
      } else if (assignmentAction === 'unassign') {
        await api.assignIssue(id, null);
      }
      await load();
    } catch (error) {
      console.error('Error updating assignment:', error);
    } finally {
      setAssignPending(false);
      setIsModalOpen(false);
      setSelectedDeveloper('');
      setAssignmentAction('');
    }
  };

  if (!issue) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Format audit log action for display
  const formatAuditAction = (log) => {
    switch (log.action) {
      case 'CREATE':
        return `created the issue`;
      case 'UPDATE':
        if (log.changes && log.changes.status) {
          return `changed status from "${log.changes.status.from}" to "${log.changes.status.to}"`;
        }
        if (log.changes && log.changes.assignee) {
          const from = log.changes.assignee.from ? `from ${log.changes.assignee.from.name}` : 'unassigned';
          const to = log.changes.assignee.to ? `to ${log.changes.assignee.to.name}` : 'unassigned';
          return `changed assignee ${from} ${to}`;
        }
        if (log.changes && log.changes.assignmentStatus) {
          return `changed assignment status from "${log.changes.assignmentStatus.from}" to "${log.changes.assignmentStatus.to}"`;
        }
        return `updated the issue`;
      case 'DELETE':
        return `deleted the issue`;
      case 'COMMENT':
        return `added a comment`;
      default:
        return `${log.action.toLowerCase()} the issue`;
    }
  };

  // Create comprehensive roadmap visualization based on audit logs and current issue state
  const getIssueRoadmap = () => {
    const roadmap = [];
    
    // 1. Issue Creation
    roadmap.push({
      id: 'creation',
      title: 'Issue Created',
      description: 'Issue was reported',
      status: 'Created',
      timestamp: issue.createdAt,
      user: issue.reporter,
      icon: '📝'
    });
    
    // 2. Process audit logs to build roadmap in chronological order
    const sortedLogs = [...auditLogs].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    sortedLogs.forEach((log, index) => {
      if (log.action === 'UPDATE' && log.changes) {
        // Handle assignment
        if (log.changes.assignee) {
          roadmap.push({
            id: `assignment-${index}`,
            title: log.changes.assignee.to ? 'Issue Assigned' : 'Assignment Removed',
            description: log.changes.assignee.to 
              ? `Assigned to ${log.changes.assignee.to.name} (${log.changes.assignee.to.email})` 
              : 'Issue unassigned by admin',
            status: log.changes.assignee.to ? 'Assigned' : 'Unassigned',
            timestamp: log.timestamp,
            user: log.performedBy,
            icon: log.changes.assignee.to ? '👤' : '❌',
            assignee: log.changes.assignee.to
          });
        }
        
        // Handle assignment status changes
        if (log.changes.assignmentStatus) {
          let title = '';
          let icon = '';
          let description = '';
          
          switch (log.changes.assignmentStatus.to) {
            case 'Accepted':
              title = 'Assignment Accepted';
              icon = '✅';
              description = `${log.performedBy.name} accepted the assignment`;
              break;
            case 'Rejected':
              title = 'Assignment Rejected';
              icon = '❌';
              description = `${log.performedBy.name} rejected the assignment`;
              break;
            case 'Pending':
              title = 'Assignment Pending';
              icon = '⏳';
              description = `Assignment status reset to pending`;
              break;
            default:
              title = `Assignment Status Changed`;
              icon = '🔄';
              description = `Assignment status changed to ${log.changes.assignmentStatus.to}`;
          }
          
          roadmap.push({
            id: `assignment-status-${index}`,
            title: title,
            description: description,
            status: log.changes.assignmentStatus.to,
            timestamp: log.timestamp,
            user: log.performedBy,
            icon: icon
          });
        }
        
        // Handle status changes
        if (log.changes.status) {
          let title = '';
          let icon = '';
          
          switch (log.changes.status.to) {
            case 'Open':
              title = 'Issue Opened';
              icon = '🔓';
              break;
            case 'In-Progress':
              title = 'Work Started';
              icon = '⚙️';
              break;
            case 'Resolved':
              title = 'Issue Resolved';
              icon = '✅';
              break;
            default:
              title = `Status Changed to ${log.changes.status.to}`;
              icon = '🔄';
          }
          
          roadmap.push({
            id: `status-${index}`,
            title: title,
            description: `Status changed from "${log.changes.status.from}" to "${log.changes.status.to}"`,
            status: log.changes.status.to,
            timestamp: log.timestamp,
            user: log.performedBy,
            icon: icon
          });
        }
      }
    });
    
    // 3. Ensure current status is represented
    const currentStatus = issue.status;
    const lastRoadmapEntry = roadmap[roadmap.length - 1];
    
    // If the last entry doesn't match current status, add it
    if (!lastRoadmapEntry || lastRoadmapEntry.status !== currentStatus) {
      let title = '';
      let icon = '';
      
      switch (currentStatus) {
        case 'Open':
          title = 'Issue Open';
          icon = '🔓';
          break;
        case 'In-Progress':
          title = 'In Progress';
          icon = '⚙️';
          break;
        case 'Resolved':
          title = 'Issue Resolved';
          icon = '✅';
          break;
        default:
          title = currentStatus;
          icon = '🔄';
      }
      
      roadmap.push({
        id: 'current',
        title: title,
        description: `Current status: ${currentStatus}`,
        status: currentStatus,
        timestamp: issue.updatedAt || issue.createdAt,
        user: issue.reporter,
        icon: icon
      });
    }
    
    return roadmap;
  };

  const roadmap = getIssueRoadmap();

  // Filter comments to show reply option based on user role and comment author
  const addReplyPermissions = (commentsTree) => {
    return commentsTree.map(comment => {
      // Determine if current user can reply to this comment
      let canReply = false;
      
      // Make sure we have the necessary data
      const commentUserId = comment.user?._id;
      const currentUserId = user?._id;
      
      if (isAdmin && commentUserId && currentUserId) {
        // Admin can reply to User and Developer comments, but not their own
        canReply = (comment.user?.role === 'User' || comment.user?.role === 'Developer') && 
                   commentUserId !== currentUserId;
      } else if (isUser && commentUserId && currentUserId) {
        // User can only reply to Admin comments, not their own
        canReply = comment.user?.role === 'Admin' && commentUserId !== currentUserId;
      } else if (isDeveloper && commentUserId && currentUserId) {
        // Developer can reply to all comments except their own
        canReply = commentUserId !== currentUserId;
      }
      
      return {
        ...comment,
        canReply: !!canReply, // Ensure it's always a boolean
        children: addReplyPermissions(comment.children || [])
      };
    });
  };

  const commentsWithPermissions = addReplyPermissions(comments);

  // Check if assignment can be changed
  const canChangeAssignment = !issue.assignee || 
                             issue.assignmentStatus === 'Rejected' || 
                             issue.assignmentStatus === 'Accepted' ||
                             assignmentAction === 'override';

  return (
    <motion.div 
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back button at the top */}
      <div className="flex justify-end">
        <Button variant="ghost" onClick={() => navigate(-1)}>Back to Issues</Button>
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div>
            <h1 className={`text-3xl font-extrabold ${textClass} bg-clip-text text-transparent bg-gradient-to-r ${
              theme === 'dark'
                ? 'from-blue-400 via-purple-400 to-pink-400'
                : 'from-blue-600 via-purple-600 to-pink-600'
            }`}>
              {issue.title}
            </h1>
            <div className="flex gap-2 mt-3 flex-wrap">
              <Badge color={issue.status === 'Resolved' ? 'green' : issue.status === 'In-Progress' ? 'blue' : 'gray'}>{issue.status}</Badge>
              <Badge color={issue.priority === 'High' || issue.priority === 'Critical' ? 'red' : issue.priority === 'Medium' ? 'yellow' : 'gray'}>
                Priority: {issue.priority}
              </Badge>
              {issue.assignmentStatus && (
                <Badge color={issue.assignmentStatus === 'Accepted' ? 'green' : issue.assignmentStatus === 'Rejected' ? 'red' : 'yellow'}>
                  Assignment: {issue.assignmentStatus}
                </Badge>
              )}
            </div>
          </div>
          {canEdit && (
            <Link to={`/issues/${id}/edit`}>
              <Button>Edit Issue</Button>
            </Link>
          )}
        </div>
        
        <div className={`text-sm ${textSecondary}`}>
          Reported by {issue.reporter?.name || 'N/A'} • Assigned to {issue.assignee?.name || 'Unassigned'}
        </div>
      </div>

      <Card className="p-6 rounded-2xl shadow-lg border">
        <h2 className={`font-bold ${textClass} text-xl mb-4`}>Description</h2>
        <p className={`whitespace-pre-wrap leading-relaxed ${textSecondary}`}>{issue.description}</p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-6 rounded-2xl shadow-lg border">
          <SectionHeader title="Comments" />
          <div className="mt-4">
            <CommentThread tree={commentsWithPermissions} onReply={onReply} />
          </div>
        </Card>

        <div className="flex flex-col gap-5">
          {(canUpdateStatus || canAssign) && (
            <Card className="p-6 rounded-2xl shadow-lg border">
              <SectionHeader title="Actions" />
              {canUpdateStatus && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {['Open', 'In-Progress', 'Resolved'].map((s) => (
                    <Button 
                      key={s} 
                      variant={issue.status === s ? 'primary' : 'outline'} 
                      disabled={statusPending} 
                      onClick={() => handleStatusChange(s)}
                      className="flex-1 min-w-[120px]"
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              )}
              {canAssign && (
                <div className="mt-4">
                  <label className={`block text-sm font-medium mb-2 ${textClass}`}>
                    Assign Issue
                  </label>
                  <div className="flex items-center gap-3">
                    <Select 
                      value={selectedDeveloper || issue.assignee?._id || ''} 
                      onChange={(e) => handleAssignClick(e.target.value)} 
                      disabled={assignPending || (issue.assignee && issue.assignmentStatus === 'Pending' && !canChangeAssignment)}
                      className="flex-1"
                    >
                      <option value="">Unassigned</option>
                      {developers.map((u) => (
                        <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                      ))}
                    </Select>
                    {issue.assignee && issue.assignmentStatus === 'Pending' && !canChangeAssignment && (
                      <div className="text-xs text-amber-600 dark:text-amber-400">
                        Pending developer response
                      </div>
                    )}
                    {issue.assignee && canChangeAssignment && (
                      <Button 
                        variant="outline" 
                        onClick={handleUnassignClick} 
                        disabled={assignPending}
                      >
                        Unassign
                      </Button>
                    )}
                  </div>
                  
                  {/* Assigned Developer Details */}
                  {issue.assignee && (
                    <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50">
                      <h4 className={`font-medium ${textClass} mb-2`}>Assigned Developer</h4>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {issue.assignee.name.charAt(0)}
                        </div>
                        <div>
                          <p className={`font-medium ${textClass}`}>{issue.assignee.name}</p>
                          <p className={`text-sm ${textSecondary}`}>{issue.assignee.email}</p>
                        </div>
                      </div>
                      {issue.assignmentStatus && (
                        <div className="mt-2">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            issue.assignmentStatus === 'Accepted' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : issue.assignmentStatus === 'Rejected'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}>
                            Assignment Status: {issue.assignmentStatus}
                          </span>
                        </div>
                      )}
                      <div className="mt-3 flex gap-2">
                        {(issue.assignmentStatus === 'Rejected' || issue.assignmentStatus === 'Accepted' || !issue.assignmentStatus) && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleUnassignClick}
                            disabled={assignPending}
                          >
                            Reassign
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          )}
          
          <Card className="p-6 rounded-2xl shadow-lg border">
            <SectionHeader title="Issue Lifecycle" />
            <div className="mt-4">
              <p className={`text-sm ${textSecondary}`}>
                Created on {new Date(issue.createdAt).toLocaleDateString()} at {new Date(issue.createdAt).toLocaleTimeString()}
              </p>
              {issue.updatedAt && issue.updatedAt !== issue.createdAt && (
                <p className={`text-sm ${textSecondary} mt-1`}>
                  Last updated on {new Date(issue.updatedAt).toLocaleDateString()} at {new Date(issue.updatedAt).toLocaleTimeString()}
                </p>
              )}
              
              {/* Comprehensive Roadmap Visualization */}
              {roadmap.length > 0 && (
                <div className="mt-6">
                  <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-green-500 dark:from-blue-400 dark:to-green-400"></div>
                    
                    {/* Roadmap items */}
                    {roadmap.map((item, index) => (
                      <div key={item.id} className="relative flex items-start mb-8 last:mb-0">
                        {/* Icon */}
                        <div className="absolute left-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold z-10">
                          {item.icon}
                        </div>
                        
                        {/* Content */}
                        <div className="ml-12 flex-1">
                          <Card className="p-4 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className={`font-bold ${textClass}`}>{item.title}</h3>
                                <p className={`text-sm ${textSecondary} mt-1`}>{item.description}</p>
                                {item.assignee && (
                                  <p className={`text-xs ${textSecondary} mt-1`}>
                                    Developer: {item.assignee.name} ({item.assignee.email})
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge color={
                                    item.status === 'Resolved' ? 'green' : 
                                    item.status === 'In-Progress' ? 'blue' : 
                                    item.status === 'Open' ? 'amber' : 
                                    item.status === 'Assigned' ? 'purple' : 
                                    item.status === 'Unassigned' ? 'red' : 
                                    item.status === 'Accepted' ? 'green' : 
                                    item.status === 'Rejected' ? 'red' : 
                                    item.status === 'Pending' ? 'yellow' : 'gray'
                                  }>
                                    {item.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`text-xs ${textSecondary}`}>{item.user?.name || 'Unknown user'}</p>
                                <p className={`text-xs ${textSecondary} mt-1`}>
                                  {new Date(item.timestamp).toLocaleDateString()}<br />
                                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          </Card>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Audit Logs - Only visible to Admin users */}
              {isAdmin && auditLogs.length > 0 && (
                <div className="mt-8">
                  <h3 className={`font-medium ${textClass} mb-3 border-b pb-2 border-gray-200 dark:border-gray-700`}>Detailed Activity Log</h3>
                  <div className="space-y-3">
                    {auditLogs.map((log) => (
                      <div key={log._id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                        <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                        <div>
                          <p className={`text-sm ${textClass}`}>
                            <span className="font-medium">{log.performedBy?.name || 'Unknown user'}</span> {formatAuditAction(log)}
                          </p>
                          <p className={`text-xs ${textSecondary} mt-1`}>
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
      
      {/* Confirmation Modal for Status Changes and Assignments */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={assignmentAction ? confirmAssignment : confirmStatusChange}
        title={
          assignmentAction === 'assign' ? 'Assign Issue' : 
          assignmentAction === 'override' ? 'Override Assignment' : 
          assignmentAction === 'unassign' ? 'Unassign Issue' : 
          'Change Issue Status'
        }
        message={
          assignmentAction === 'assign' ? `Are you sure you want to assign this issue to the selected developer?` : 
          assignmentAction === 'override' ? `Are you sure you want to override the existing assignment and assign this issue to a different developer?` : 
          assignmentAction === 'unassign' ? `Are you sure you want to unassign this issue from ${issue.assignee?.name}?` : 
          `Are you sure you want to change the issue status to "${pendingStatus}"?`
        }
        confirmText="Confirm"
        cancelText="Cancel"
      />
    </motion.div>
  );
}