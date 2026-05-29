export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://social-media-video-downloader-api-1.onrender.com";
const API_KEY = process.env.API_KEY || "dk_streamaura_fix_999";

function getCorsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
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
    message: "API Route Ready (video-info)",
    method: "GET"
  }, { headers: getCorsHeaders(origin) });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  try {
    const body = await request.json();
    const cleanApiUrl = API_URL.replace(/\/$/, "");

    const response = await axios({
      method: "POST",
      url: `${cleanApiUrl}/info`,
      data: body,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      validateStatus: () => true,
    });

    return NextResponse.json(response.data, {
      status: response.status,
      headers: corsHeaders,
    });
  } catch (error: any) {
    console.error("Proxy error:", error);
    return NextResponse.json({ 
      error: "Proxy error", 
      message: error.message 
    }, { 
      status: 500, 
      headers: corsHeaders 
    });
  }
}
