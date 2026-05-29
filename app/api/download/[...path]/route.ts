import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const API_KEY = process.env.API_KEY!;
const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_APP_URL;

function isValidRequest(request: NextRequest): boolean {
  if (process.env.NODE_ENV === "development") return true;
  if (!ALLOWED_ORIGIN) return true;
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  if ((!origin || origin !== ALLOWED_ORIGIN) && (!referer || !referer.startsWith(ALLOWED_ORIGIN))) {
    return false;
  }
  return true;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest(request, path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest(request, path);
}

async function handleRequest(request: NextRequest, path: string[]) {
  if (!isValidRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (!API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const targetUrl = `${API_URL}/download/${path.join("/")}`;
    const body = request.method === "POST" ? await request.json() : undefined;

    const response = await axios({
      method: request.method,
      url: targetUrl,
      data: body,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
        host: new URL(API_URL).host,
      },
      validateStatus: () => true,
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

