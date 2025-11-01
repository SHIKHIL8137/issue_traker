import AuditLog from '../models/AuditLog.js';

// @desc    Get all audit logs (Admin only)
export const getAllAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const logs = await AuditLog.find()
      .populate('performedBy', 'name email role')
      .populate('issue', 'title')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AuditLog.countDocuments();

    res.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch audit logs', error: error.message });
  }
};

// @desc    Get audit logs for a specific issue
export const getAuditLogsByIssue = async (req, res) => {
  try {
    const { issueId } = req.params;

    const logs = await AuditLog.find({ issue: issueId })
      .populate('performedBy', 'name email role')
      .sort({ timestamp: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch issue audit logs', error: error.message });
  }
};