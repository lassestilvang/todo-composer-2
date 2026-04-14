import { z } from "zod";

export const listSchema = z.object({
  name: z.string().min(1).max(80),
  color: z.string().min(4).max(20).default("#6366f1"),
  emoji: z.string().min(1).max(4).default("🗂️"),
});

export const labelSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().min(4).max(20).default("#22c55e"),
  icon: z.string().min(1).max(4).default("🏷️"),
});
