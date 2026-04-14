import { NextResponse } from "next/server";
import { createLabel, getLabels } from "@/lib/services/list-service";

export async function GET() {
  return NextResponse.json({ labels: getLabels() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = createLabel(body);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid request" }, { status: 400 });
  }
}
