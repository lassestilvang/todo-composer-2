import { NextResponse } from "next/server";
import { searchTasks } from "@/lib/search/task-search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  if (!q) {
    return NextResponse.json({ results: [] });
  }

  return NextResponse.json({ results: searchTasks(q) });
}
