import { randomUUID } from "node:crypto";
import { initDb, rawDb } from "@/db/client";
import { labelSchema, listSchema } from "@/lib/validation/list";

export function getLists() {
  initDb();
  return rawDb.prepare("SELECT * FROM lists ORDER BY is_inbox DESC, created_at ASC").all();
}

export function createList(input: unknown) {
  initDb();
  const payload = listSchema.parse(input);
  const id = randomUUID();
  rawDb.prepare("INSERT INTO lists (id, name, color, emoji, is_inbox) VALUES (?, ?, ?, ?, 0)").run(id, payload.name, payload.color, payload.emoji);
  return id;
}

export function getLabels() {
  initDb();
  return rawDb.prepare("SELECT * FROM labels ORDER BY created_at ASC").all();
}

export function createLabel(input: unknown) {
  initDb();
  const payload = labelSchema.parse(input);
  const id = randomUUID();
  rawDb.prepare("INSERT INTO labels (id, name, color, icon) VALUES (?, ?, ?, ?)").run(id, payload.name, payload.color, payload.icon);
  return id;
}
