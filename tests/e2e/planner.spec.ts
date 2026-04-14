import { expect, test } from "playwright/test";

test("planner shell loads", async ({ page }) => {
  await page.goto("/today");
  await expect(page.getByText("Daily Planner")).toBeVisible();
  await expect(page.getByText("New Task")).toBeVisible();
});
