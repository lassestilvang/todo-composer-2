import { randomUUID } from "node:crypto";
import { getDateRangeForView } from "@/lib/services/view-service";
import { logTaskChange } from "@/lib/tasks/audit-log";
import { taskInputSchema, taskUpdateSchema } from "@/lib/validation/task";
import { initDb, rawDb } from "@/db/client";

export function getTasks(view: "today" | "next-7-days" | "upcoming" | "all", showCompleted: boolean) {
  initDb();
  const range = getDateRangeForView(view);
  const completedClause = showCompleted ? "" : "AND t.completed = 0";

  if (view === "all") {
    return rawDb
      .prepare(
        `SELECT t.*, l.name as list_name, l.color as list_color, l.emoji as list_emoji
         FROM tasks t JOIN lists l ON l.id = t.list_id
         WHERE 1=1 ${completedClause}
         ORDER BY COALESCE(t.scheduled_date, t.deadline, '9999-12-31') ASC, t.created_at DESC`
      )
      .all();
  }

  if (range.end) {
    return rawDb
      .prepare(
        `SELECT t.*, l.name as list_name, l.color as list_color, l.emoji as list_emoji
         FROM tasks t JOIN lists l ON l.id = t.list_id
         WHERE t.scheduled_date >= ? AND t.scheduled_date <= ? ${completedClause}
         ORDER BY t.scheduled_date ASC, t.deadline ASC, t.created_at DESC`
      )
      .all(range.start, range.end);
  }

  return rawDb
    .prepare(
      `SELECT t.*, l.name as list_name, l.color as list_color, l.emoji as list_emoji
       FROM tasks t JOIN lists l ON l.id = t.list_id
       WHERE (t.scheduled_date >= ? OR t.scheduled_date IS NULL) ${completedClause}
       ORDER BY COALESCE(t.scheduled_date, t.deadline, '9999-12-31') ASC, t.created_at DESC`
    )
    .all(range.start);
}

export function getOverdueCount() {
  initDb();
  const today = new Date().toISOString().slice(0, 10);
  const row = rawDb
    .prepare("SELECT COUNT(*) as count FROM tasks WHERE completed = 0 AND deadline IS NOT NULL AND deadline < ?")
    .get(today) as { count: number };
  return row.count;
}

export function getTaskById(taskId: string) {
  initDb();
  const task = rawDb.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId);
  if (!task) return null;

  const subtasks = rawDb.prepare("SELECT * FROM subtasks WHERE task_id = ? ORDER BY rowid ASC").all(taskId);
  const reminders = rawDb.prepare("SELECT * FROM reminders WHERE task_id = ? ORDER BY remind_at ASC").all(taskId);
  const labels = rawDb
    .prepare(
      `SELECT lb.* FROM labels lb
       JOIN task_labels tl ON tl.label_id = lb.id
       WHERE tl.task_id = ?`
    )
    .all(taskId);
  const history = rawDb.prepare("SELECT * FROM task_history WHERE task_id = ? ORDER BY created_at DESC").all(taskId);

  return { ...task, subtasks, reminders, labels, history };
}

export function createTask(input: unknown) {
  initDb();
  const payload = taskInputSchema.parse(input);
  const taskId = randomUUID();

  const stmt = rawDb.prepare(
    `INSERT INTO tasks (id, list_id, title, description, scheduled_date, deadline, estimate_minutes, actual_minutes, priority, recurring, recurring_rule, attachment_url, completed)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`
  );

  const tx = rawDb.transaction(() => {
    stmt.run(
      taskId,
      payload.listId,
      payload.title,
      payload.description ?? null,
      payload.scheduledDate ?? null,
      payload.deadline ?? null,
      payload.estimateMinutes ?? null,
      payload.actualMinutes ?? null,
      payload.priority,
      payload.recurring,
      payload.recurringRule ?? null,
      payload.attachmentUrl ?? null
    );

    for (const subtask of payload.subtasks) {
      rawDb.prepare("INSERT INTO subtasks (id, task_id, title, completed) VALUES (?, ?, ?, ?)").run(randomUUID(), taskId, subtask.title, subtask.completed ? 1 : 0);
    }

    for (const reminder of payload.reminders) {
      rawDb.prepare("INSERT INTO reminders (id, task_id, remind_at) VALUES (?, ?, ?)").run(randomUUID(), taskId, reminder);
    }

    for (const labelId of payload.labelIds) {
      rawDb.prepare("INSERT OR IGNORE INTO task_labels (task_id, label_id) VALUES (?, ?)").run(taskId, labelId);
    }

    logTaskChange(taskId, "created");
  });

  tx();
  return taskId;
}

export function updateTask(input: unknown) {
  initDb();
  const payload = taskUpdateSchema.parse(input);
  const existing = rawDb.prepare("SELECT * FROM tasks WHERE id = ?").get(payload.id) as Record<string, unknown> | undefined;
  if (!existing) {
    throw new Error("Task not found");
  }

  const merged = {
    ...existing,
    title: payload.title ?? existing.title,
    description: payload.description ?? existing.description,
    listId: payload.listId ?? existing.list_id,
    scheduledDate: payload.scheduledDate ?? existing.scheduled_date,
    deadline: payload.deadline ?? existing.deadline,
    estimateMinutes: payload.estimateMinutes ?? existing.estimate_minutes,
    actualMinutes: payload.actualMinutes ?? existing.actual_minutes,
    priority: payload.priority ?? existing.priority,
    recurring: payload.recurring ?? existing.recurring,
    recurringRule: payload.recurringRule ?? existing.recurring_rule,
    attachmentUrl: payload.attachmentUrl ?? existing.attachment_url,
    completed: payload.completed ?? Boolean(existing.completed),
  };

  rawDb
    .prepare(
      `UPDATE tasks
       SET list_id = ?, title = ?, description = ?, scheduled_date = ?, deadline = ?, estimate_minutes = ?, actual_minutes = ?,
           priority = ?, recurring = ?, recurring_rule = ?, attachment_url = ?, completed = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    )
    .run(
      merged.listId,
      merged.title,
      merged.description,
      merged.scheduledDate,
      merged.deadline,
      merged.estimateMinutes,
      merged.actualMinutes,
      merged.priority,
      merged.recurring,
      merged.recurringRule,
      merged.attachmentUrl,
      merged.completed ? 1 : 0,
      payload.id
    );

  if (payload.subtasks) {
    rawDb.prepare("DELETE FROM subtasks WHERE task_id = ?").run(payload.id);
    for (const subtask of payload.subtasks) {
      rawDb.prepare("INSERT INTO subtasks (id, task_id, title, completed) VALUES (?, ?, ?, ?)").run(randomUUID(), payload.id, subtask.title, subtask.completed ? 1 : 0);
    }
  }

  if (payload.reminders) {
    rawDb.prepare("DELETE FROM reminders WHERE task_id = ?").run(payload.id);
    for (const reminder of payload.reminders) {
      rawDb.prepare("INSERT INTO reminders (id, task_id, remind_at) VALUES (?, ?, ?)").run(randomUUID(), payload.id, reminder);
    }
  }

  if (payload.labelIds) {
    rawDb.prepare("DELETE FROM task_labels WHERE task_id = ?").run(payload.id);
    for (const labelId of payload.labelIds) {
      rawDb.prepare("INSERT OR IGNORE INTO task_labels (task_id, label_id) VALUES (?, ?)").run(payload.id, labelId);
    }
  }

  logTaskChange(payload.id, "updated");
  return payload.id;
}

export function toggleTask(taskId: string, completed: boolean) {
  initDb();
  rawDb.prepare("UPDATE tasks SET completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(completed ? 1 : 0, taskId);
  logTaskChange(taskId, completed ? "completed" : "reopened", "completed", completed ? "0" : "1", completed ? "1" : "0");
}

export function deleteTask(taskId: string) {
  initDb();
  rawDb.prepare("DELETE FROM tasks WHERE id = ?").run(taskId);
}
