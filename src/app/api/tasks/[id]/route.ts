import { NextResponse } from "next/server";
import { deleteTask, toggleTask, updateTask } from "@/lib/services/task-service";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (typeof body.completed === "boolean") {
      toggleTask(id, body.completed);
      return NextResponse.json({ ok: true });
    }

    updateTask({ ...body, id });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  deleteTask(id);
  return NextResponse.json({ ok: true });
}
