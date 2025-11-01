import Issue from '../models/Issue.js';
import AuditLog from '../models/AuditLog.js';
import { createIssueSchema, updateIssueSchema } from '../validation/issueSchema.js';

// Helper to log audit
const logAudit = async (issueId, action, userId, oldValue = null, newValue = null, changes = null) => {
  await AuditLog.create({ issue: issueId, action, performedBy: userId, oldValue, newValue, changes });
};

// @desc    Create new issue (User+)
export const createIssue = async (req, res) => {
  try {
    const result = createIssueSchema.safeParse(req.body);

    if (!result.success) {
      // Handle validation errors properly
      const errorMessage = result.error?.errors?.[0]?.message || 'Invalid input data';
      return res.status(400).json({
        message: errorMessage,
      });
    }

    const value = result.data;

    const issue = await Issue.create({
      ...value,
      reporter: req.user._id,
    });

    await logAudit(issue._id, 'CREATE', req.user._id);

    res.status(201).json(issue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all issues
export const getIssues = async (req, res) => {
  const { status, priority, assignee, assigneeExists, unassigned } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  
  // Handle special assignee filters
  if (assigneeExists === 'true') {
    filter.assignee = { $exists: true, $ne: null };
  } else if (unassigned === 'true') {
    filter.$or = [
      { assignee: { $exists: false } },
      { assignee: null }
    ];
  } else if (assignee) {
    filter.assignee = assignee;
  }

  // Users see only their reported issues unless Admin/Developer
  if (req.user.role === 'User') {
    filter.reporter = req.user._id;
  }

  const issues = await Issue.find(filter)
    .populate('reporter', 'name email')
    .populate('assignee', 'name email')
    .sort({ createdAt: -1 });

  res.json(issues);
};

// @desc    Get single issue
export const getIssueById = async (req, res) => {
  const issue = await Issue.findById(req.params.id)
    .populate('reporter', 'name')
    .populate('assignee', 'name email')
    .populate({
      path: 'comments',
      populate: { path: 'user', select: 'name' }
    });

  if (!issue) return res.status(404).json({ message: 'Issue not found' });

  // Restrict if User and not reporter
  if (req.user.role === 'User' && issue.reporter._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  res.json(issue);
};

// @desc    Update issue (role-based)
export const updateIssue = async (req, res) => {
  try {
    const result = updateIssueSchema.safeParse(req.body);
    if (!result.success) {
      // Handle validation errors properly
      const errorMessage = result.error?.errors?.[0]?.message || 'Invalid input data';
      return res.status(400).json({ message: errorMessage });
    }
    const value = result.data;

    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    // Only reporter (if User), Developer, or Admin can edit
    if (req.user.role === 'User' && issue.reporter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updates = {};
    const changes = {};

    if (value.status && value.status !== issue.status) {
      // Implement status flow restrictions
      const isValidTransition = 
        (issue.status === 'Open' && value.status === 'In-Progress') || // Open → In-Progress
        (issue.status === 'In-Progress' && value.status === 'Resolved') || // In-Progress → Resolved
        (issue.status === 'Resolved' && value.status === 'In-Progress'); // Allow Resolved → In-Progress for corrections
      
      if (!isValidTransition) {
        return res.status(400).json({ 
          message: `Invalid status transition from ${issue.status} to ${value.status}` 
        });
      }
      
      changes.status = { from: issue.status, to: value.status };
      updates.status = value.status;
    }
    if (value.assignee !== undefined && value.assignee !== issue.assignee?.toString()) {
      // Check if there's already a pending assignment
      if (issue.assignee && issue.assignmentStatus === 'Pending') {
        return res.status(400).json({ 
          message: 'Cannot change assignment while there is a pending assignment. Please wait for the developer to accept or reject, or unassign first.' 
        });
      }
      
      changes.assignee = { 
        from: issue.assignee ? { name: issue.assignee.name, email: issue.assignee.email, _id: issue.assignee._id } : null,
        to: value.assignee ? await getUserInfo(value.assignee) : null
      };
      updates.assignee = value.assignee || null;
      
      // Reset assignment status when reassigning
      if (value.assignee) {
        updates.assignmentStatus = 'Pending';
      } else {
        // When unassigning, also reset assignment status
        updates.assignmentStatus = null;
      }
    }
    if (value.title && value.title !== issue.title) {
      changes.title = { from: issue.title, to: value.title };
      updates.title = value.title;
    }
    if (value.description && value.description !== issue.description) {
      changes.description = { from: issue.description, to: value.description };
      updates.description = value.description;
    }
    if (value.priority && value.priority !== issue.priority) {
      changes.priority = { from: issue.priority, to: value.priority };
      updates.priority = value.priority;
    }

    // Only Admin can assign
    if (value.assignee !== undefined && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Only Admin can assign issues' });
    }

    // Only Developer/Admin can change status
    if (value.status && !['Developer', 'Admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only Developer or Admin can update status' });
    }

    // If there are changes, save and log them
    if (Object.keys(updates).length > 0) {
      Object.assign(issue, updates);
      await issue.save();

      // Log audit with changes
      if (Object.keys(changes).length > 0) {
        await logAudit(
          issue._id,
          'UPDATE',
          req.user._id,
          null,
          null,
          changes
        );
      }
    }

    const updatedIssue = await Issue.findById(issue._id)
      .populate('reporter', 'name')
      .populate('assignee', 'name email');

    res.json(updatedIssue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Accept issue assignment (Developer)
export const acceptAssignment = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    // Check if issue is assigned to this developer
    if (!issue.assignee || issue.assignee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Issue not assigned to you' });
    }

    // Update assignment status
    issue.assignmentStatus = 'Accepted';
    await issue.save();

    // Log audit
    await logAudit(
      issue._id,
      'UPDATE',
      req.user._id,
      null,
      null,
      { assignmentStatus: { from: 'Pending', to: 'Accepted' } }
    );

    const updatedIssue = await Issue.findById(issue._id)
      .populate('reporter', 'name')
      .populate('assignee', 'name email');

    res.json(updatedIssue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Reject issue assignment (Developer)
export const rejectAssignment = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    // Check if issue is assigned to this developer
    if (!issue.assignee || issue.assignee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Issue not assigned to you' });
    }

    // Update assignment status and remove assignee
    issue.assignmentStatus = 'Rejected';
    issue.assignee = null;
    await issue.save();

    // Log audit
    await logAudit(
      issue._id,
      'UPDATE',
      req.user._id,
      null,
      null,
      { 
        assignmentStatus: { from: 'Pending', to: 'Rejected' },
        assignee: { from: { name: req.user.name, _id: req.user._id }, to: null }
      }
    );

    const updatedIssue = await Issue.findById(issue._id)
      .populate('reporter', 'name')
      .populate('assignee', 'name email');

    res.json(updatedIssue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Helper function to get user info for audit logs
const getUserInfo = async (userId) => {
  if (!userId) return null;
  try {
    // Use a dynamic import to avoid circular dependencies
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(userId, 'name email');
    return user ? { name: user.name, email: user.email, _id: user._id } : null;
  } catch (error) {
    return null;
  }
};

// @desc    Delete issue (Admin only)
export const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    await issue.deleteOne();
    await logAudit(issue._id, 'DELETE', req.user._id);

    res.json({ message: 'Issue removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};