import { describe, expect, test } from "bun:test";
import { taskInputSchema } from "@/lib/validation/task";

describe("task validation", () => {
  test("accepts valid task payload", () => {
    const parsed = taskInputSchema.parse({ title: "Write docs" });
    expect(parsed.priority).toBe("none");
    expect(parsed.listId).toBe("inbox");
  });

  test("rejects empty title", () => {
    expect(() => taskInputSchema.parse({ title: "" })).toThrow();
  });
});
