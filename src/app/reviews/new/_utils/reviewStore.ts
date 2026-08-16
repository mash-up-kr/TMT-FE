import type { ReviewStore } from "../_model/store";

/**
 * "다음" 게이트. 검색어 문자열이 아니라 확정된 매장 객체로 판정하므로,
 * 검색 선택 경로와 직접 입력 경로가 같은 조건을 쓴다.
 */
export function isReviewStoreComplete(store: ReviewStore | null): store is ReviewStore {
  return store !== null && store.name.trim().length > 0 && store.address !== null;
}
