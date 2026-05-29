import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://social-media-video-downloader-api-1.onrender.com";
const API_KEY = process.env.API_KEY || "dk_streamaura_fix_999";
const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_APP_URL;

function getCorsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-API-Key, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin");
  return NextResponse.json({ 
    status: "ok", 
    message: "Info route is reachable via GET",
    config: {
      hasUrl: !!API_URL,
      hasKey: !!API_KEY,
      origin: ALLOWED_ORIGIN || "not set"
    }
  }, { headers: getCorsHeaders(origin) });
}

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

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  try {
    if (!isValidRequest(request)) {
      return NextResponse.json({ error: "Unauthorized Request Origin" }, { status: 403, headers: corsHeaders });
    }

    if (!API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500, headers: corsHeaders });
    }

    const cleanApiUrl = API_URL.replace(/\/$/, "");
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400, headers: corsHeaders });
    }

    const targetUrl = `${cleanApiUrl}/info`;
    
    const response = await axios({
      method: "POST",
      url: targetUrl,
      data: body,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
        host: new URL(cleanApiUrl).host,
      },
      validateStatus: () => true,
    });

    return NextResponse.json(response.data, {
      status: response.status,
      headers: corsHeaders
    });
  } catch (error: any) {
    console.error("API proxy error:", error);
    return NextResponse.json({ 
      error: "Internal server error in Proxy", 
      details: error.message,
      target: API_URL
    }, {
      status: 500,
      headers: corsHeaders
    });
  }
}
