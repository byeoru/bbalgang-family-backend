import db from "@/lib/db";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  if (!code || !state) {
    return notFound();
  }

  const accessTokenParams = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: process.env.KAKAO_CLIENT_ID!,
    redirect_uri: `http://${request.nextUrl.host}/api/auth/kakao/complete`,
    code,
    client_secret: process.env.KAKAO_CLIENT_SECRET!,
  }).toString();
  const accessTokenUrl = `https://kauth.kakao.com/oauth/token?${accessTokenParams}`;

  const accessTokenResponse = await fetch(accessTokenUrl, {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });
  const { token_type, access_token } = await accessTokenResponse.json();

  if (!access_token) {
    return notFound();
  }

  const userProfileResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
    headers: {
      Authorization: `${token_type} ${access_token}`,
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    cache: "no-cache",
  });
  const {
    id,
    profile: { nickname },
  } = await userProfileResponse.json();

  if (!id || !nickname) {
    return notFound();
  }

  const user = await db.user.findUnique({
    where: {
      kakao_id: id.toString(),
    },
    select: {
      id: true,
    },
  });

  if (user) {
    return NextResponse.json({ id, nickname });
  }
}
