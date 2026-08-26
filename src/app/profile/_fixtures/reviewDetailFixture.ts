/** 상세 계약이 붙으면 이 파일도 함께 지운다. */

import dummyImage from "@/shared/assets/dummy-image.png";
import type { ReviewDetail } from "@/shared/components/ReviewDetailSheet/ReviewDetailSheet";
import type { ProfileReviewItem } from "../_model/profile";

const EMPTY: ReviewDetail = {
  placeName: "",
  address: null,
  categoryName: null,
  rating: null,
  tags: [],
  photos: [],
  pros: null,
  cons: null,
  content: null,
};

export function toReviewDetailFixture(review: ProfileReviewItem | null): ReviewDetail {
  if (!review) {
    return EMPTY;
  }

  return {
    placeName: review.placeName,
    address: "서울 마포구 도화동 200-14",
    categoryName: review.categoryName,
    rating: 4.5,
    tags: [
      { id: "tag_alone", label: "혼자" },
      { id: "tag_tasty", label: "음식이 맛있어요" },
    ],
    photos: [{ id: `${review.reviewId}_1`, url: review.thumbnailUrl || dummyImage.src }],
    pros: "분위기가 좋아요",
    cons: "가격이 좀 나가고 웨이팅이 많아요",
    content: "맛도 있고 분위기도 좋아요. 원두도 종류가 많았어요",
  };
}
