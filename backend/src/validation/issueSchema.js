import { z } from 'zod';

export const createIssueSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).optional()
});

export const updateIssueSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(10).optional(),
  status: z.enum(['Open', 'In-Progress', 'Resolved']).optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
  assignee: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Assignee ID').nullable().optional()
});