import type { ReviewCardResponse } from "@/api/gen/_model/reviewCardResponse.gen";
import type { ReviewCardData } from "@/shared/model/review";

export function toReviewCardData(review: ReviewCardResponse): ReviewCardData {
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
