import { NextResponse } from "next/server";
import { createTask } from "@/lib/services/task-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = createTask(body);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid request" }, { status: 400 });
  }
}
