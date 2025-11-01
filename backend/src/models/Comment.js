import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  issue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }
}, { timestamps: true });

commentSchema.index({ issue: 1, parentComment: 1 });

export default mongoose.model('Comment', commentSchema);