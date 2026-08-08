const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

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

function getAccessToken(): string | null {
  return null;
}

function extractMessage(body: unknown, fallback: string): string {
  if (typeof body === "object" && body !== null && "message" in body) {
    const { message } = body as { message?: unknown };
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

  const token = getAccessToken();
  if (token !== null) {
    headers.set("Authorization", `Bearer ${token}`);
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
