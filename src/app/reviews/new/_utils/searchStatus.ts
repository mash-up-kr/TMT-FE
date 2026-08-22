import type { SearchStatus } from "../_model/search";

/**
 * 검색어와 쿼리 결과로 시트가 보여줄 상태를 정한다.
 *
 * 검색어가 비면 요청 자체가 없으므로 결과 영역은 `idle`이다. 에러를 로딩보다 먼저 보는 이유는
 * 재요청 중에도 직전 실패를 계속 알려야 하기 때문이다.
 */
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
