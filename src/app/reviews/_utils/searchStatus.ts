import type { SearchStatus } from "../_model/search";

export function toSearchStatus(
  query: string,
  result: Readonly<{ isFetching: boolean; isError: boolean }>,
): SearchStatus {
  if (query.length === 0) {
    return "idle";
  }

  if (result.isError) {
    return "error";
  }

  return result.isFetching ? "loading" : "ready";
}
