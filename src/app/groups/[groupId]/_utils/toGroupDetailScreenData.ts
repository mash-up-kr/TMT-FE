import type { GroupDetailResponse } from "@/api/gen/_model/groupDetailResponse.gen";
import type { JoinPreviewResponse } from "@/api/gen/_model/joinPreviewResponse.gen";
import type { GroupDetailScreenData } from "@/app/groups/[groupId]/_components/GroupDetailScreen";

export function toGroupDetailScreenData(
  detail: GroupDetailResponse,
  joinPreview?: JoinPreviewResponse,
): GroupDetailScreenData {
  return {
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
    availableTicketCount: joinPreview?.availableTicketCount ?? 0,
    isJoinable: joinPreview?.joinable ?? false,
    isMember: detail.isMember,
  };
}
