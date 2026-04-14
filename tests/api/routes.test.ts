import { describe, expect, test } from "bun:test";
import { listSchema, labelSchema } from "@/lib/validation/list";
import { taskInputSchema } from "@/lib/validation/task";

describe("API boundary validation", () => {
  test("list payload validation enforces name", () => {
    const parsed = listSchema.parse({ name: "Research", color: "#ff00aa", emoji: "🧠" });
    expect(parsed.name).toBe("Research");
  });

  test("label payload validation supports custom icon", () => {
    const parsed = labelSchema.parse({ name: "Urgent", color: "#ef4444", icon: "🔥" });
    expect(parsed.icon).toBe("🔥");
  });

  test("task payload requires title and supports priority", () => {
    const parsed = taskInputSchema.parse({ title: "Pay bills", priority: "high" });
    expect(parsed.priority).toBe("high");
  });
});
