import { z } from "zod";

export const subtaskSchema = z.object({
  title: z.string().min(1),
  completed: z.boolean().default(false),
});

export const taskInputSchema = z.object({
  listId: z.string().default("inbox"),
  title: z.string().min(1).max(180),
  description: z.string().max(3000).nullable().optional(),
  scheduledDate: z.string().nullable().optional(),
  deadline: z.string().nullable().optional(),
  reminders: z.array(z.string()).default([]),
  estimateMinutes: z.number().int().min(0).max(24 * 60).nullable().optional(),
  actualMinutes: z.number().int().min(0).max(24 * 60).nullable().optional(),
  labelIds: z.array(z.string()).default([]),
  priority: z.enum(["none", "low", "medium", "high"]).default("none"),
  subtasks: z.array(subtaskSchema).default([]),
  recurring: z
    .enum(["none", "every_day", "every_week", "every_weekday", "every_month", "every_year", "custom"])
    .default("none"),
  recurringRule: z.string().nullable().optional(),
  attachmentUrl: z.string().url().nullable().optional(),
});

export const taskUpdateSchema = taskInputSchema.partial().extend({
  id: z.string(),
  completed: z.boolean().optional(),
});
