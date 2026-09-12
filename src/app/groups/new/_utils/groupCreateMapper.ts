import type { GroupDetailResponse } from "@/api/gen/_model/groupDetailResponse.gen";
import type { GroupRequest } from "@/api/gen/_model/groupRequest.gen";
import type { MyReviewGridItem } from "@/api/gen/_model/myReviewGridItem.gen";
import { hasText } from "@/shared/utils/hasText";
import type { CreatedGroupData, GroupCreateDraft, GroupReviewOption } from "../_model/groupCreate";

export function toGroupCreateRequest(draft: GroupCreateDraft): GroupRequest {
  return {
    name: draft.groupName.trim(),
    oneLineDescription: draft.summaryDescription.trim(),
    foodCategoryId: draft.foodCategoryId,
    regionTagIds: draft.regionIds,
    imageAssetId: draft.groupImageId,
    description: draft.detailedDescription?.trim() || undefined,
  };
}

export function toCreatedGroupData(response: GroupDetailResponse): CreatedGroupData {
  return { id: response.groupId };
}

/** 내 리뷰 목록 응답에는 본문 미리보기가 없다 (TMT-428). 받기 전까지 본문 영역을 비운다. */
export function toGroupReviewOptions(
  items: readonly MyReviewGridItem[] | undefined,
): GroupReviewOption[] {
  return (items ?? []).map((item) => ({
    reviewId: item.reviewId,
    placeName: item.place.name,
    thumbnailUrl: hasText(item.thumbnailUrl) ? item.thumbnailUrl : null,
    contentPreview: null,
  }));
}
