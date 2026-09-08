import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { TokenRefreshResponse } from "@/api/gen/_model/tokenRefreshResponse.gen";
import { getTmtApiErrorCode, TmtApiError } from "@/api/mutator";
import { SITE_ORIGIN } from "@/shared/constants/site";

export const REFRESH_COOKIE = "tmt-refresh";
export const STATE_COOKIE = "tmt-kakao-state";
export const CALLBACK_PATH = "/auth/kakao/callback";
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60;
const AUTH_CODES = new Set([
  "AUTH_TOKEN_EXPIRED",
  "AUTH_TOKEN_INVALID",
  "UNAUTHORIZED",
  "AUTH_KAKAO_CODE_INVALID",
  "AUTH_KAKAO_UNAVAILABLE",
]);

export function authJson(body: unknown, status = 200) {
  return privateAuthResponse(NextResponse.json(body, { status }));
}

export function authRedirect(path: string, request: NextRequest) {
  return privateAuthResponse(NextResponse.redirect(new URL(path, request.url), 303));
}

function privateAuthResponse(response: NextResponse) {
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}

export function isAllowedOrigin(origin: string) {
  return origin === SITE_ORIGIN || origin === "http://localhost:3000";
}

/** SameSite만 믿지 않고, 쿠키를 사용하는 POST의 출처를 검사한다. */
function isSameOriginRequest(request: NextRequest) {
  const origin = request.headers.get("origin");
  return (
    origin !== null &&
    isAllowedOrigin(origin) &&
    origin === new URL(request.url).origin &&
    request.headers.get("sec-fetch-site") !== "cross-site"
  );
}

/** 인증 POST의 실제 처리는 출처 검사를 통과한 뒤에만 실행한다. */
export async function handleAuthPost(
  request: NextRequest,
  handler: (request: NextRequest) => NextResponse | Promise<NextResponse>,
) {
  if (!isSameOriginRequest(request)) return authJson({ code: "AUTH_ORIGIN_INVALID" }, 403);
  return privateAuthResponse(await handler(request));
}

export function setRefreshCookie(response: NextResponse, request: NextRequest, value: string) {
  response.cookies.set(REFRESH_COOKIE, value, {
    httpOnly: true,
    secure: new URL(request.url).protocol === "https:",
    sameSite: "lax",
    path: "/api/auth",
    maxAge: value ? REFRESH_MAX_AGE : 0,
  });
}

export function setStateCookie(response: NextResponse, request: NextRequest, value: string) {
  response.cookies.set(STATE_COOKIE, value, {
    httpOnly: true,
    secure: new URL(request.url).protocol === "https:",
    sameSite: "lax",
    path: CALLBACK_PATH,
    maxAge: value ? 600 : 0,
  });
}

export function isToken(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length < 3800 &&
    /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value)
  );
}

export function isTokenPair(value: unknown): value is TokenRefreshResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "accessToken" in value &&
    isToken(value.accessToken) &&
    "refreshToken" in value &&
    isToken(value.refreshToken) &&
    "accessTokenExpiresIn" in value &&
    typeof value.accessTokenExpiresIn === "number" &&
    Number.isSafeInteger(value.accessTokenExpiresIn) &&
    value.accessTokenExpiresIn > 0
  );
}

/** 상류 응답 원문에는 토큰·인가 코드가 포함될 수 있어 그대로 전달하거나 기록하지 않는다. */
export function authFailure(error: unknown) {
  const code = getTmtApiErrorCode(error);
  const status =
    error instanceof TmtApiError && [400, 401, 403, 429, 502, 503].includes(error.httpStatus)
      ? error.httpStatus
      : 502;
  return authJson({ code: code && AUTH_CODES.has(code) ? code : "AUTH_UNAVAILABLE" }, status);
}
