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

export function getTmtApiErrorCode(error: unknown): string | undefined {
  if (!(error instanceof TmtApiError)) return undefined;
  const body: unknown = error.body;
  return typeof body === "object" &&
    body !== null &&
    "code" in body &&
    typeof body.code === "string"
    ? body.code
    : undefined;
}

export function getTmtApiErrorTitle(error: unknown): string | undefined {
  if (!(error instanceof TmtApiError)) return undefined;
  const body: unknown = error.body;
  if (
    typeof body !== "object" ||
    body === null ||
    !("title" in body) ||
    typeof body.title !== "string"
  ) {
    return undefined;
  }
  return body.title.trim() || undefined;
}
