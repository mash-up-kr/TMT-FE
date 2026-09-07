import type { NextRequest } from "next/server";
import { refreshToken } from "@/api/gen/auth/auth.gen";
import {
  authFailure,
  authJson,
  handleAuthPost,
  isToken,
  isTokenPair,
  REFRESH_COOKIE,
  setRefreshCookie,
} from "@/app/_utils/authServer";

export async function POST(request: NextRequest) {
  return handleAuthPost(request, async (request) => {
    const token = request.cookies.get(REFRESH_COOKIE)?.value;
    if (!isToken(token)) {
      const response = authJson({ code: "UNAUTHORIZED" }, 401);
      setRefreshCookie(response, request, "");
      return response;
    }
    try {
      const pair: unknown = await refreshToken(
        { refreshToken: token },
        { cache: "no-store", signal: AbortSignal.timeout(10_000) },
      );
      if (!isTokenPair(pair)) return authJson({ code: "AUTH_RESPONSE_INVALID" }, 502);
      const response = authJson({
        accessToken: pair.accessToken,
        accessTokenExpiresIn: pair.accessTokenExpiresIn,
      });
      setRefreshCookie(response, request, pair.refreshToken);
      return response;
    } catch (error) {
      const response = authFailure(error);
      // 네트워크·서버 오류는 로그인 만료가 아니다. 재시도를 위해 쿠키를 보존한다.
      if (response.status === 401) setRefreshCookie(response, request, "");
      return response;
    }
  });
}
