import type { ReviewSharesResponse } from "@/api/gen/_model/reviewSharesResponse.gen";
import type { ReviewShareItem } from "../_model/reviewShare";

type ReviewShareResponseItem = ReviewSharesResponse["items"][number];

function hasText(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * 명세(H §3-1)는 `thumbnailUrl`을 non-null로 적었지만, 사진 없는 리뷰가 생긴 뒤(C4-1)로는 비어 올
 * 수 있다 (TMT-352). 빈 값을 `null`로 고쳐 화면이 대체 이미지를 그리게 한다.
 */
export function toReviewShareItems(
  items: readonly ReviewShareResponseItem[] | undefined,
): ReviewShareItem[] {
  return (items ?? []).map((item) => ({
    reviewId: item.reviewId,
    placeName: item.placeName,
    thumbnailUrl: hasText(item.thumbnailUrl) ? item.thumbnailUrl : null,
    contentPreview: item.contentPreview,
  }));
}
