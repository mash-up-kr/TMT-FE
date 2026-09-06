import type { GroupDetailResponse } from "@/api/gen/_model/groupDetailResponse.gen";
import type { GroupDetailViewData } from "../_model/groupDetail";

export function toGroupDetailViewData(detail: GroupDetailResponse): GroupDetailViewData {
  return {
    id: detail.groupId,
    name: detail.name,
    oneLineDescription: detail.oneLineDescription,
    description: detail.description ?? null,
    coverImageUrl: detail.coverImages.at(0)?.url ?? detail.imageUrl ?? null,
    imageUrl: detail.imageUrl ?? null,
    memberCount: detail.memberCount,
    reviewCount: detail.reviewCount,
    placeCount: detail.placeCount,
    tags: [detail.foodCategory.label, ...detail.regionTags.map((tag) => tag.label)],
    matchedSavedPlaceCount: detail.matchedSavedPlaceCount,
    isOwner: detail.isOwner,
    isMember: detail.isMember,
  };
}
