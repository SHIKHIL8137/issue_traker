import { z } from 'zod';

export const createCommentSchema = z.object({
  issueId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Issue ID'),
  text: z.string().min(1).max(1000),
  parentCommentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Parent Comment ID').optional().nullable()
});