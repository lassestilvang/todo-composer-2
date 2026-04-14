import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const lists = sqliteTable("lists", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull().default("#6d28d9"),
  emoji: text("emoji").notNull().default("📥"),
  isInbox: integer("is_inbox", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const labels = sqliteTable("labels", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull().default("#22c55e"),
  icon: text("icon").notNull().default("🏷️"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  listId: text("list_id").notNull().references(() => lists.id),
  title: text("title").notNull(),
  description: text("description"),
  scheduledDate: text("scheduled_date"),
  deadline: text("deadline"),
  estimateMinutes: integer("estimate_minutes"),
  actualMinutes: integer("actual_minutes"),
  priority: text("priority").notNull().default("none"),
  recurring: text("recurring").notNull().default("none"),
  recurringRule: text("recurring_rule"),
  attachmentUrl: text("attachment_url"),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const subtasks = sqliteTable("subtasks", {
  id: text("id").primaryKey(),
  taskId: text("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
});

export const reminders = sqliteTable("reminders", {
  id: text("id").primaryKey(),
  taskId: text("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
  remindAt: text("remind_at").notNull(),
});

export const taskLabels = sqliteTable("task_labels", {
  taskId: text("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
  labelId: text("label_id").notNull().references(() => labels.id, { onDelete: "cascade" }),
});

export const taskHistory = sqliteTable("task_history", {
  id: text("id").primaryKey(),
  taskId: text("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  field: text("field"),
  before: text("before"),
  after: text("after"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const listRelations = relations(lists, ({ many }) => ({
  tasks: many(tasks),
}));

export const taskRelations = relations(tasks, ({ one, many }) => ({
  list: one(lists, { fields: [tasks.listId], references: [lists.id] }),
  subtasks: many(subtasks),
  reminders: many(reminders),
  taskLabels: many(taskLabels),
  history: many(taskHistory),
}));
