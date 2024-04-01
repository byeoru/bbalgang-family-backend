import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const baseUrl = "https://kauth.kakao.com/oauth/authorize";
  return NextResponse.json({ testValue: 123 });
}
