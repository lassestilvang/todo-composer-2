export const priorities = ["none", "low", "medium", "high"] as const;
export type TaskPriority = (typeof priorities)[number];

export const recurrenceKinds = [
  "none",
  "every_day",
  "every_week",
  "every_weekday",
  "every_month",
  "every_year",
  "custom",
] as const;
export type RecurrenceKind = (typeof recurrenceKinds)[number];

export type PlannerView = "today" | "next-7-days" | "upcoming" | "all";

export interface TaskRecord {
  id: string;
  listId: string;
  title: string;
  description: string | null;
  scheduledDate: string | null;
  deadline: string | null;
  estimateMinutes: number | null;
  actualMinutes: number | null;
  priority: TaskPriority;
  recurring: RecurrenceKind;
  recurringRule: string | null;
  completed: number;
  attachmentUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
