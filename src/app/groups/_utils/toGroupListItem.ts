import type { GroupCardResponse } from "@/api/gen/_model/groupCardResponse.gen";
import type { GroupListItem } from "../_model/group";

export function toGroupListItem(response: GroupCardResponse): GroupListItem | null {
  // id가 없으면 상세로 갈 수도, 목록에서 구분할 수도 없어 그리지 않는다.
  if (!response.groupId) {
    return null;
  }

  return {
    id: response.groupId,
    thumbnail: response.coverImageUrl ?? null,
    name: response.name ?? "",
    description: response.oneLineDescription ?? "",
    memberCount: response.memberCount ?? 0,
    reviewCount: response.reviewCount ?? 0,
    placeCount: response.placeCount ?? 0,
    matchedCount: response.matchedSavedPlaceCount ?? 0,
  };
}
