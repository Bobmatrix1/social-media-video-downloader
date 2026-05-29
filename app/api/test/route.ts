import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok", message: "GET reachable" });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ status: "ok", message: "POST reachable", body });
  } catch {
    return NextResponse.json({ status: "error", message: "POST reached but body failed" });
  }
}
