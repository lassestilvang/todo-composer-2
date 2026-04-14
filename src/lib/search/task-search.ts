import Fuse from "fuse.js";
import { rawDb } from "@/db/client";

export function searchTasks(query: string) {
  const tasks = rawDb
    .prepare(
      `SELECT t.id, t.title, t.description, t.scheduled_date as scheduledDate, t.priority, l.name as listName
       FROM tasks t JOIN lists l ON l.id = t.list_id`
    )
    .all() as Array<Record<string, string | null>>;

  const fuse = new Fuse(tasks, {
    includeScore: true,
    threshold: 0.4,
    keys: ["title", "description", "listName"],
  });

  return fuse.search(query).map((result) => result.item);
}
