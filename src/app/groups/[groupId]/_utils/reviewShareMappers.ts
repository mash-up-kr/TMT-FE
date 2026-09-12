import type { ReviewSharesResponse } from "@/api/gen/_model/reviewSharesResponse.gen";
import { hasText } from "@/shared/utils/hasText";
import type { ReviewShareItem } from "../_model/reviewShare";

type ReviewShareResponseItem = ReviewSharesResponse["items"][number];

/**
 * 사진 없이 작성된 리뷰는 `thumbnailUrl`이 비어 온다. 빈 값을 `null`로 고쳐 화면이 대체
 * 이미지를 그리게 한다.
 */
export function toReviewShareItems(
  items: readonly ReviewShareResponseItem[] | undefined,
): ReviewShareItem[] {
  return (items ?? []).map((item) => ({
    reviewId: item.reviewId,
    placeName: item.placeName,
    thumbnailUrl: hasText(item.thumbnailUrl) ? item.thumbnailUrl : null,
    contentPreview: item.contentPreview,
    isShared: item.isShared,
  }));
}
