import Comment from '../models/Comment.js';
import Issue from '../models/Issue.js';
import AuditLog from '../models/AuditLog.js';
import { createCommentSchema } from '../validation/commentSchema.js';

export const addComment = async (req, res) => {
  const result = createCommentSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ message: result.error.errors[0].message });
  const value = result.data;

  const { issueId, text, parentCommentId } = value;

  const issue = await Issue.findById(issueId);
  if (!issue) return res.status(404).json({ message: 'Issue not found' });

  if (req.user.role === 'User' && issue.reporter.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to comment' });
  }

  const comment = await Comment.create({
    issue: issueId,
    user: req.user._id,
    text,
    parentComment: parentCommentId || null
  });

  await Issue.findByIdAndUpdate(issueId, { $push: { comments: comment._id } });
  await AuditLog.create({
    issue: issueId,
    action: 'comment_added',
    performedBy: req.user._id,
    newValue: text
  });

  const populated = await Comment.findById(comment._id).populate('user', 'name');
  res.status(201).json(populated);
};

export const getCommentsByIssue = async (req, res) => {
  const comments = await Comment.find({ issue: req.params.issueId })
    .populate('user', 'name')
    .sort({ createdAt: 1 });

  const commentMap = {};
  const roots = [];

  comments.forEach(c => {
    commentMap[c._id] = { ...c.toObject(), replies: [] };
    if (!c.parentComment) {
      roots.push(commentMap[c._id]);
    } else if (commentMap[c.parentComment]) {
      commentMap[c.parentComment].replies.push(commentMap[c._id]);
    }
  });

  res.json(roots);
};