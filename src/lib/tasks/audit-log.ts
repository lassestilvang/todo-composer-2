import { randomUUID } from "node:crypto";
import { rawDb } from "@/db/client";

export function logTaskChange(taskId: string, action: string, field?: string, before?: string | null, after?: string | null) {
  rawDb
    .prepare(
      "INSERT INTO task_history (id, task_id, action, field, before, after) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(randomUUID(), taskId, action, field ?? null, before ?? null, after ?? null);
}
