import type { SaveListItemResponse } from "@/api/gen/_model/saveListItemResponse.gen";

/**
 * 이어 쓸 수 있는 초안인가.
 *
 * `GET /v1/saves`는 완료되지 않은 초안만 돌려주므로 목록에 있으면 "쓰다 만 것"이다. 다만 사진이
 * 붙은 초안은 이어 쓸 수 없다. 상세 응답이 사진의 assetId를 돌려주지 않아 복원할 수 없기 때문이다.
 *
 * 이 판단은 마이페이지 안내 시트, 이어쓰기 선택 화면, 그룹 진입 세 곳이 함께 쓴다. 한 곳만 다르게
 * 세면 "이어 쓸 게 있다"고 안내한 뒤 고를 게 없는 화면에 도착한다.
 */
export function isContinuableSave(item: Pick<SaveListItemResponse, "thumbnailUrl">): boolean {
  return (item.thumbnailUrl?.trim().length ?? 0) === 0;
}
