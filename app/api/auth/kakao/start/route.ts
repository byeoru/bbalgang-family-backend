import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const baseUrl = "https://kauth.kakao.com/oauth/authorize";
  const params = {
    client_id: process.env.KAKAO_CLIENT_ID!,
    redirect_uri: `https://${request.nextUrl.host}/api/auth/kakao/complete`,
    response_type: "code",
    state: process.env.KAKAO_STATE!,
  };
  const formattedParams = new URLSearchParams(params).toString();
  const finalUrl = `${baseUrl}?${formattedParams}`;
  console.log(`finalUrl: ${finalUrl}`);
  console.log(`params: ${formattedParams}`);
  return redirect(finalUrl);
}
