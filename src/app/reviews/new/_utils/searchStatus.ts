import type { SearchStatus } from "../_model/search";

/**
 * 검색어와 쿼리 결과로 시트가 보여줄 상태를 정한다.
 *
 * 검색어가 비면 요청 자체가 없으므로 결과 영역은 `idle`이다. 에러를 로딩보다 먼저 보는 이유는
 * 재요청 중에도 직전 실패를 계속 알려야 하기 때문이다. 에러가 이전 결과보다 앞서는 이유도 같다 —
 * 다른 검색어의 결과를 조용히 남겨두는 것보다 실패를 알리는 편이 정확하다.
 *
 * 로딩은 **보여줄 결과가 아직 없을 때만**이다. 이전 결과가 남아 있으면 그대로 두고 새 응답으로
 * 갈아끼운다. 재검색마다 목록을 로딩 문구로 바꾸면 검색어를 고칠 때마다 화면이 비었다 찬다.
 */
export function toSearchStatus(
  query: string,
  result: Readonly<{ isFetching: boolean; isError: boolean; data: unknown }>,
): SearchStatus {
  if (query.length === 0) {
    return "idle";
  }

  if (result.isError) {
    return "error";
  }

  if (result.isFetching && result.data === undefined) {
    return "loading";
  }

  return "ready";
}
