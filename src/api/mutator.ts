import { getAccessToken, getSessionSnapshot, logoutSession, refreshSession } from "./auth-session";
import { getTmtApiErrorCode, TmtApiError } from "./error";

export { getTmtApiErrorCode, getTmtApiErrorTitle, TmtApiError } from "./error";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const IDEMPOTENCY_KEY_METHODS = new Set(["POST", "PUT"]);
const AUTH_PATHS = new Set(["/v1/auth/login/kakao", "/v1/auth/token/refresh"]);

// orval 생성 코드가 참조하는 타입 계약이다.
export type ErrorType<Error> = TmtApiError<Error>;
export type BodyType<BodyData> = BodyData;

function resolveUrl(url: string): string {
  return /^https?:\/\//.test(url) ? url : `${BASE_URL}${url}`;
}

function extractMessage(body: unknown, fallback: string): string {
  if (typeof body === "object" && body !== null && "message" in body) {
    const { message } = body;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }
  return fallback;
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const text = await response.text();
  if (text.length === 0) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("json")) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new TmtApiError("응답 JSON을 해석할 수 없습니다.", response.status, text);
  }
}

export const tmtFetch = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const headers = new Headers(init?.headers);

  if (typeof init?.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // 외부 절대 URL에는 서비스 토큰을 보내지 않는다. 생성 client는 상대 경로를 사용한다.
  const isBrowserRequest =
    typeof window !== "undefined" && url.startsWith("/v1/") && !AUTH_PATHS.has(url);
  const requestRevision = getSessionSnapshot().revision;
  const requestToken = isBrowserRequest ? getAccessToken() : null;
  if (requestToken) headers.set("Authorization", `Bearer ${requestToken}`);

  const method = (init?.method ?? "GET").toUpperCase();
  if (IDEMPOTENCY_KEY_METHODS.has(method) && !headers.has("Idempotency-Key")) {
    headers.set("Idempotency-Key", crypto.randomUUID());
  }

  async function send(): Promise<T> {
    const response = await fetch(resolveUrl(url), { ...init, headers });
    const body = await parseBody(response);
    if (!response.ok) {
      throw new TmtApiError(
        extractMessage(body, `${response.status} ${response.statusText}`),
        response.status,
        body,
      );
    }
    return body as T;
  }

  try {
    return await send();
  } catch (error) {
    if (
      !isBrowserRequest ||
      requestRevision !== getSessionSnapshot().revision ||
      !(error instanceof TmtApiError) ||
      error.httpStatus !== 401
    )
      throw error;
    const code = getTmtApiErrorCode(error);
    if (code === "AUTH_TOKEN_EXPIRED" && requestToken) {
      // 이미 다른 요청이 갱신했다면 그 토큰을 쓴다. 로그아웃 뒤에는 세션을 되살리지 않는다.
      const currentToken = getAccessToken();
      if (!currentToken) throw error;
      const token = currentToken === requestToken ? await refreshSession() : currentToken;
      if (requestRevision !== getSessionSnapshot().revision || getAccessToken() !== token)
        throw error;
      init?.signal?.throwIfAborted();
      headers.set("Authorization", `Bearer ${token}`);
      try {
        return await send();
      } catch (retryError) {
        if (
          retryError instanceof TmtApiError &&
          retryError.httpStatus === 401 &&
          getAccessToken() === token
        ) {
          void logoutSession().catch(() => undefined);
        }
        throw retryError;
      }
    }
    if (
      (code === "AUTH_TOKEN_INVALID" || code === "UNAUTHORIZED") &&
      requestToken === getAccessToken()
    ) {
      void logoutSession().catch(() => undefined);
    }
    throw error;
  }
};
