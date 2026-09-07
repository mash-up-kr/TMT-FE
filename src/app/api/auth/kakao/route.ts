import { randomBytes } from "node:crypto";
import type { NextRequest } from "next/server";
import { authJson, CALLBACK_PATH, handleAuthPost, setStateCookie } from "@/app/_utils/authServer";
import { safeReturnTo } from "@/shared/utils/authNavigation";

export async function POST(request: NextRequest) {
  return handleAuthPost(request, async (request) => {
    const restApiKey = process.env.KAKAO_REST_API_KEY;
    if (!restApiKey || !/^[a-f0-9]{32}$/i.test(restApiKey)) {
      return authJson({ code: "AUTH_UNAVAILABLE" }, 503);
    }
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return authJson({ code: "INVALID_REQUEST" }, 400);
    }
    const returnTo = safeReturnTo(
      typeof body === "object" && body !== null && "returnTo" in body ? body.returnTo : undefined,
    );
    const state = randomBytes(32).toString("hex");
    const authorizationUrl = new URL("https://kauth.kakao.com/oauth/authorize");
    authorizationUrl.search = new URLSearchParams({
      response_type: "code",
      client_id: restApiKey,
      redirect_uri: new URL(CALLBACK_PATH, request.url).href,
      state,
    }).toString();
    const response = authJson({ authorizationUrl: authorizationUrl.href });
    setStateCookie(response, request, JSON.stringify({ state, returnTo }));
    return response;
  });
}
