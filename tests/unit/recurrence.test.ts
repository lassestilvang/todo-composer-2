import { describe, expect, test } from "bun:test";
import { nextOccurrence } from "@/lib/services/recurrence";

describe("recurrence helper", () => {
  test("moves daily task by one day", () => {
    expect(nextOccurrence("2026-04-14", "every_day")).toBe("2026-04-15");
  });

  test("handles weekday skipping weekend", () => {
    expect(nextOccurrence("2026-04-17", "every_weekday")).toBe("2026-04-20");
  });
});
