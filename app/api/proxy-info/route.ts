import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const dynamic = 'force-dynamic';

const API_URL = "https://social-media-video-downloader-api-1.onrender.com";
const API_KEY = "dk_6452f829837c4e5a9b2d1c3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
    },
  });
}

export async function GET() {
  return NextResponse.json({ status: "ok", mode: "proxy-info-ready" });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const response = await axios({
      method: "POST",
      url: `${API_URL}/info`,
      data: body,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      validateStatus: () => true,
    });

    return NextResponse.json(response.data, {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Proxy Failed", message: error.message }, { status: 500 });
  }
}
