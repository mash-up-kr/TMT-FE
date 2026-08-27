import { TmtApiError } from "@/api/mutator";

const GROUP_OWNER_CANNOT_LEAVE = "GROUP_OWNER_CANNOT_LEAVE";

export function getGroupLeaveErrorTitle(error: unknown): string | undefined {
  if (!(error instanceof TmtApiError)) {
    return undefined;
  }

  const { body } = error;

  if (typeof body !== "object" || body === null || !("code" in body) || !("title" in body)) {
    return undefined;
  }

  if (body.code !== GROUP_OWNER_CANNOT_LEAVE || typeof body.title !== "string") {
    return undefined;
  }

  const title = body.title.trim();
  return title.length > 0 ? title : undefined;
}
