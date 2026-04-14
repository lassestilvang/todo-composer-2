import { initDb, rawDb } from "@/db/client";

initDb();

const inbox = rawDb.prepare("SELECT id FROM lists WHERE id = 'inbox'").get();
if (!inbox) {
  rawDb.prepare("INSERT INTO lists (id, name, color, emoji, is_inbox) VALUES ('inbox', 'Inbox', '#6366f1', '📥', 1)").run();
}

console.log("Database seeded.");
