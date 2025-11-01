import Issue from '../models/Issue.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

// @desc    Get Admin Dashboard Statistics
export const getAdminStats = async (req, res) => {
  try {
    // Total counts
    const totalIssues = await Issue.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalDevelopers = await User.countDocuments({ role: 'Developer' });
    
    // Issues by status
    const issuesByStatus = await Issue.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Issues by priority
    const issuesByPriority = await Issue.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent activity (last 10 audit logs)
    const recentActivity = await AuditLog.find()
      .populate('performedBy', 'name email')
      .populate('issue', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    // Issues created per day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const issuesOverTime = await Issue.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Top reporters
    const topReporters = await Issue.aggregate([
      {
        $group: {
          _id: '$reporter',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          name: '$user.name',
          email: '$user.email',
          count: 1
        }
      }
    ]);

    // Unassigned issues
    const unassignedIssues = await Issue.countDocuments({ assignee: null });

    // Critical issues
    const criticalIssues = await Issue.countDocuments({ 
      priority: 'Critical',
      status: { $ne: 'Resolved' }
    });

    res.json({
      totalIssues,
      totalUsers,
      totalDevelopers,
      unassignedIssues,
      criticalIssues,
      issuesByStatus: issuesByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      issuesByPriority: issuesByPriority.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentActivity,
      issuesOverTime,
      topReporters
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin statistics', error: error.message });
  }
};

// @desc    Get Developer Dashboard Statistics
export const getDeveloperStats = async (req, res) => {
  try {
    const developerId = req.user._id;

    // Issues assigned to developer
    const assignedIssues = await Issue.countDocuments({ assignee: developerId });
    
    // Issues by status for this developer
    const myIssuesByStatus = await Issue.aggregate([
      {
        $match: { assignee: developerId }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Issues by priority for this developer
    const myIssuesByPriority = await Issue.aggregate([
      {
        $match: { assignee: developerId }
      },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent assigned issues
    const recentAssignedIssues = await Issue.find({ assignee: developerId })
      .populate('reporter', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Resolved issues count (this month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const resolvedThisMonth = await Issue.countDocuments({
      assignee: developerId,
      status: 'Resolved',
      updatedAt: { $gte: startOfMonth }
    });

    // In-progress issues
    const inProgressIssues = await Issue.countDocuments({
      assignee: developerId,
      status: 'In-Progress'
    });

    // Open issues assigned to developer
    const openIssues = await Issue.countDocuments({
      assignee: developerId,
      status: 'Open'
    });

    // All unassigned issues (available to pick)
    const availableIssues = await Issue.find({ assignee: null })
      .populate('reporter', 'name email')
      .sort({ priority: -1, createdAt: -1 })
      .limit(10);

    res.json({
      assignedIssues,
      openIssues,
      inProgressIssues,
      resolvedThisMonth,
      myIssuesByStatus: myIssuesByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      myIssuesByPriority: myIssuesByPriority.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentAssignedIssues,
      availableIssues
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching developer statistics', error: error.message });
  }
};

// @desc    Get User Dashboard Statistics
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Total issues reported by user
    const totalReported = await Issue.countDocuments({ reporter: userId });

    // Issues by status for this user
    const myIssuesByStatus = await Issue.aggregate([
      {
        $match: { reporter: userId }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Issues by priority for this user
    const myIssuesByPriority = await Issue.aggregate([
      {
        $match: { reporter: userId }
      },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent issues reported by user
    const recentIssues = await Issue.find({ reporter: userId })
      .populate('assignee', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Open issues count
    const openIssues = await Issue.countDocuments({
      reporter: userId,
      status: 'Open'
    });

    // In-progress issues count
    const inProgressIssues = await Issue.countDocuments({
      reporter: userId,
      status: 'In-Progress'
    });

    // Resolved issues count
    const resolvedIssues = await Issue.countDocuments({
      reporter: userId,
      status: 'Resolved'
    });

    // Average resolution time (in days) for resolved issues
    const resolvedIssuesWithTime = await Issue.find({
      reporter: userId,
      status: 'Resolved'
    }).select('createdAt updatedAt');

    let avgResolutionTime = 0;
    if (resolvedIssuesWithTime.length > 0) {
      const totalTime = resolvedIssuesWithTime.reduce((sum, issue) => {
        const diff = new Date(issue.updatedAt) - new Date(issue.createdAt);
        return sum + diff;
      }, 0);
      avgResolutionTime = Math.round(totalTime / resolvedIssuesWithTime.length / (1000 * 60 * 60 * 24));
    }

    res.json({
      totalReported,
      openIssues,
      inProgressIssues,
      resolvedIssues,
      avgResolutionTime,
      myIssuesByStatus: myIssuesByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      myIssuesByPriority: myIssuesByPriority.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentIssues
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user statistics', error: error.message });
  }
};

