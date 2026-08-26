import type { CursorPageReviewCardResponse } from "@/api/gen/_model/cursorPageReviewCardResponse.gen";
import type { PlaceDetailResponse } from "@/api/gen/_model/placeDetailResponse.gen";
import type { ReviewCardResponse } from "@/api/gen/_model/reviewCardResponse.gen";
import type { ReviewCardReview } from "@/shared/components/ReviewCard/ReviewCard";

export interface PlaceDetail {
  id: string;
  name: string;
  categoryName: string | null;
  averageRating: number | null;
  reviewCount: number;
  photoUrls: string[];
  roadAddress: string;
  phoneNumber: string | null;
}

export function toPlaceDetail(response: PlaceDetailResponse): PlaceDetail {
  return {
    id: response.placeId,
    name: response.name,
    categoryName: response.categoryName ?? null,
    averageRating: response.averageRating ?? null,
    reviewCount: response.reviewCount,
    // 스펙은 photoId·order를 선언하지만 서버는 url·reviewId만 보낸다. url만 의존한다.
    photoUrls: response.photos.map((photo) => photo.url),
    roadAddress: response.roadAddress,
    phoneNumber: response.phoneNumber ?? null,
  };
}

function toReview(review: ReviewCardResponse): ReviewCardReview {
  return {
    id: review.reviewId,
    authorNickname: review.author.nickname,
    authorProfileImageUrl: review.author.profileImageUrl ?? null,
    rating: review.rating,
    distanceMeters: review.distanceMeters ?? null,
    photoUrls: review.photos
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((photo) => photo.url),
    pros: review.aiSummary?.pros ?? null,
    cons: review.aiSummary?.cons ?? null,
    content: review.content,
    tags: review.tags.map((tag) => ({ id: tag.tagId, label: tag.label })),
    place: {
      id: review.place.placeId,
      name: review.place.name,
      regionName: review.place.regionName,
      isFavorite: review.place.isFavorite,
    },
  };
}

export function toPlaceReviews(page: CursorPageReviewCardResponse): ReviewCardReview[] {
  return page.items.map(toReview);
}
