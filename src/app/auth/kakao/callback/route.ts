import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { loginWithKakao } from "@/api/gen/auth/auth.gen";
import {
  authFailure,
  authRedirect,
  isAllowedOrigin,
  isTokenPair,
  STATE_COOKIE,
  setRefreshCookie,
  setStateCookie,
} from "@/app/_utils/authServer";
import { ROUTES } from "@/shared/constants/routes";
import { safeReturnTo } from "@/shared/utils/authNavigation";

function readState(value: string | undefined): { state: string; returnTo: string } | null {
  try {
    const parsed: unknown = JSON.parse(value ?? "null");
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("state" in parsed) ||
      typeof parsed.state !== "string" ||
      !/^[a-f0-9]{64}$/.test(parsed.state)
    )
      return null;
    return {
      state: parsed.state,
      returnTo: safeReturnTo("returnTo" in parsed ? parsed.returnTo : undefined),
    };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  let verifiedReturnTo: string | undefined;
  const failure = (reason: string) => {
    const params = new URLSearchParams({ error: reason });
    if (verifiedReturnTo) params.set("returnTo", verifiedReturnTo);
    const response = authRedirect(`${ROUTES.LOGIN}?${params}`, request);
    setStateCookie(response, request, "");
    return response;
  };
  if (!isAllowedOrigin(new URL(request.url).origin)) return failure("origin");
  const saved = readState(request.cookies.get(STATE_COOKIE)?.value);
  const state = request.nextUrl.searchParams.get("state");
  if (
    !saved ||
    !state ||
    !/^[a-f0-9]{64}$/.test(state) ||
    !timingSafeEqual(Buffer.from(state), Buffer.from(saved.state))
  )
    return failure("state");
  // state가 일치한 뒤에만 검증된 복귀 경로를 실패·재시도에도 전달한다.
  verifiedReturnTo = saved.returnTo;
  if (request.nextUrl.searchParams.has("error")) return failure("cancelled");
  const code = request.nextUrl.searchParams.get("code");
  if (!code || code.length > 2048) return failure("code");
  try {
    const result: unknown = await loginWithKakao(
      { code, redirectUri: new URL(request.nextUrl.pathname, request.url).href },
      { cache: "no-store", signal: AbortSignal.timeout(10_000) },
    );
    if (!isTokenPair(result) || !("isNewUser" in result) || typeof result.isNewUser !== "boolean") {
      console.error("[auth:kakao] Invalid login response contract");
      return failure("unavailable");
    }
    const params = new URLSearchParams({
      new: result.isNewUser ? "1" : "0",
      returnTo: saved.returnTo,
    });
    const response = authRedirect(`/auth/complete?${params}`, request);
    setRefreshCookie(response, request, result.refreshToken);
    setStateCookie(response, request, "");
    return response;
  } catch (error) {
    const diagnostic = authFailure(error);
    console.error("[auth:kakao] Login exchange failed", {
      status: diagnostic.status,
      error: await diagnostic.json(),
    });
    return failure("unavailable");
  }
}
