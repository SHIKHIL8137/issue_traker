import Issue from '../models/Issue.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

export const getAdminStats = async (req, res) => {
  try {
    const totalIssues = await Issue.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalDevelopers = await User.countDocuments({ role: 'Developer' });
    
    const issuesByStatus = await Issue.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const issuesByPriority = await Issue.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentActivity = await AuditLog.find()
      .populate('performedBy', 'name email')
      .populate('issue', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

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

    const unassignedIssues = await Issue.countDocuments({ assignee: null });

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

export const getDeveloperStats = async (req, res) => {
  try {
    const developerId = req.user._id;

    const assignedIssues = await Issue.countDocuments({ assignee: developerId });
    
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

    const recentAssignedIssues = await Issue.find({ assignee: developerId })
      .populate('reporter', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const resolvedThisMonth = await Issue.countDocuments({
      assignee: developerId,
      status: 'Resolved',
      updatedAt: { $gte: startOfMonth }
    });

    const inProgressIssues = await Issue.countDocuments({
      assignee: developerId,
      status: 'In-Progress'
    });

    const openIssues = await Issue.countDocuments({
      assignee: developerId,
      status: 'Open'
    });

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

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const myIssues = await Issue.countDocuments({ reporter: userId });
    
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

    const recentIssues = await Issue.find({ reporter: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const openIssues = await Issue.countDocuments({
      reporter: userId,
      status: { $ne: 'Resolved' }
    });

    const resolvedIssues = await Issue.countDocuments({
      reporter: userId,
      status: 'Resolved'
    });

    res.json({
      myIssues,
      openIssues,
      resolvedIssues,
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