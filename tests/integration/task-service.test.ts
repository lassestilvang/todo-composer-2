import { describe, expect, test } from "bun:test";
import { getDateRangeForView } from "@/lib/services/view-service";
import { taskInputSchema, taskUpdateSchema } from "@/lib/validation/task";

describe("planner integration rules", () => {
  test("next 7 days range computes bounded end", () => {
    const range = getDateRangeForView("next-7-days");
    expect(range.start).toBeTruthy();
    expect(range.end).toBeTruthy();
  });

  test("update schema accepts partial updates", () => {
    const parsed = taskUpdateSchema.parse({ id: "abc", completed: true });
    expect(parsed.id).toBe("abc");
    expect(parsed.completed).toBeTrue();
  });

  test("task schema supports extended planner fields", () => {
    const parsed = taskInputSchema.parse({
      title: "Complex task",
      reminders: ["2026-04-14T09:30:00.000Z"],
      subtasks: [{ title: "Sub 1", completed: false }],
      recurring: "every_week",
      estimateMinutes: 60,
      actualMinutes: 45,
    });

    expect(parsed.reminders.length).toBe(1);
    expect(parsed.subtasks.length).toBe(1);
    expect(parsed.recurring).toBe("every_week");
  });
});
