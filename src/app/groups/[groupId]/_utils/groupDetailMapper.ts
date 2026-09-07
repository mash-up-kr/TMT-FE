import type { GroupDetailResponse } from "@/api/gen/_model/groupDetailResponse.gen";
import type { GroupDetailViewData } from "../_model/groupDetail";

export function toGroupDetailViewData(detail: GroupDetailResponse): GroupDetailViewData {
  return {
    id: detail.groupId,
    name: detail.name,
    oneLineDescription: detail.oneLineDescription,
    description: detail.description ?? null,
    coverImageUrls:
      detail.coverImages.length > 0
        ? detail.coverImages.map((image) => image.url)
        : detail.imageUrl
          ? [detail.imageUrl]
          : [],
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
