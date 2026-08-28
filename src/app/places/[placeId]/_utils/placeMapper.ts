import type { CursorPageReviewCardResponse } from "@/api/gen/_model/cursorPageReviewCardResponse.gen";
import type { PlaceDetailResponse } from "@/api/gen/_model/placeDetailResponse.gen";
import type { ReviewCardData } from "@/shared/model/review";
import { toReviewCardData } from "@/shared/utils/reviewMapper";

export interface PlaceDetail {
  id: string;
  name: string;
  categoryName: string | null;
  averageRating: number | null;
  reviewCount: number;
  photoUrls: string[];
  roadAddress: string;
  phoneNumber: string | null;
  isFavorite: boolean;
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
    isFavorite: response.isFavorite,
  };
}

export function toPlaceReviews(page: CursorPageReviewCardResponse): ReviewCardData[] {
  return page.items.map(toReviewCardData);
}
