const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
// 라우트 `_constants/mockUser.ts`가 같은 환경 변수를 쿼리 파라미터용으로 읽는다. import 경계상
// 상수를 공유할 수 없으므로 두 곳이 같은 규칙으로 검증한다 (양수 정수가 아니면 기본값).
const DEFAULT_MOCK_USER_ID = 1;
const configuredMockUserId = Number(process.env.NEXT_PUBLIC_MOCK_USER_ID);
const MOCK_USER_ID = String(
  Number.isSafeInteger(configuredMockUserId) && configuredMockUserId > 0
    ? configuredMockUserId
    : DEFAULT_MOCK_USER_ID,
);

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
    headers.set("X-User-Id", MOCK_USER_ID);
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
