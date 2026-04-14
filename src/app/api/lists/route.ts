import { NextResponse } from "next/server";
import { createList, getLists } from "@/lib/services/list-service";

export async function GET() {
  return NextResponse.json({ lists: getLists() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = createList(body);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid request" }, { status: 400 });
  }
}
