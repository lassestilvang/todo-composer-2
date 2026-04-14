import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "./data/planner.sqlite",
  },
} satisfies Config;
