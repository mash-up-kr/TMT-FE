const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const MOCK_USER_ID = process.env.NEXT_PUBLIC_MOCK_USER_ID ?? "1";
const MOCK_USER_ID_STORAGE_KEY = "tmt-mock-user-id";
const IDEMPOTENCY_KEY_METHODS = new Set(["POST", "PUT"]);

export type MockUserId = "1" | "2" | "3" | "4";

function isMockUserId(value: string | null): value is MockUserId {
  return value === "1" || value === "2" || value === "3" || value === "4";
}

function getMockUserId(): string {
  if (typeof window === "undefined") {
    return MOCK_USER_ID;
  }

  try {
    const storedUserId = window.localStorage.getItem(MOCK_USER_ID_STORAGE_KEY);
    return isMockUserId(storedUserId) ? storedUserId : MOCK_USER_ID;
  } catch {
    return MOCK_USER_ID;
  }
}

export function setMockUserId(userId: MockUserId): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(MOCK_USER_ID_STORAGE_KEY, userId);
  } catch {
    // 브라우저 저장소가 막힌 환경에서는 환경 변수의 기본 사용자로 요청한다.
  }
}

export class TmtApiError<TBody = unknown> extends Error {
  readonly httpStatus: number;
  readonly body: TBody;

  constructor(message: string, httpStatus: number, body: TBody) {
    super(message);
    this.name = "TmtApiError";
    this.httpStatus = httpStatus;
    this.body = body;
  }
}

// orval 생성 코드가 참조하는 타입 계약이다.
export type ErrorType<Error> = TmtApiError<Error>;
export type BodyType<BodyData> = BodyData;

export function getTmtApiErrorTitle(error: unknown): string | undefined {
  if (!(error instanceof TmtApiError)) {
    return undefined;
  }

  const { body } = error;

  if (typeof body !== "object" || body === null || !("title" in body)) {
    return undefined;
  }

  const { title } = body;

  if (typeof title !== "string") {
    return undefined;
  }

  const trimmedTitle = title.trim();
  return trimmedTitle.length > 0 ? trimmedTitle : undefined;
}

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

  if (!headers.has("X-User-Id")) {
    headers.set("X-User-Id", getMockUserId());
  }

  const method = (init?.method ?? "GET").toUpperCase();
  if (IDEMPOTENCY_KEY_METHODS.has(method) && !headers.has("Idempotency-Key")) {
    headers.set("Idempotency-Key", crypto.randomUUID());
  }

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
};
