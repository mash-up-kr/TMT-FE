import type { CursorPageReviewCardResponse } from "@/api/gen/_model/cursorPageReviewCardResponse.gen";
import type { GroupCardResponse } from "@/api/gen/_model/groupCardResponse.gen";
import type { HomeResponse } from "@/api/gen/_model/homeResponse.gen";
import type { MyGroup } from "@/api/gen/_model/myGroup.gen";
import type { ReviewCardResponse } from "@/api/gen/_model/reviewCardResponse.gen";
import type {
  FeedReview,
  FeedReviewPlace,
  HomeGroup,
  HomeRecommendedGroup,
  HomeSummary,
} from "../_model/home";

function toMyGroup(group: MyGroup): HomeGroup | null {
  if (!group.groupId || !group.name) {
    return null;
  }

  return {
    id: group.groupId,
    name: group.name,
    imageUrl: group.imageUrl ?? null,
  };
}

function toRecommendedGroup(group: GroupCardResponse): HomeRecommendedGroup | null {
  if (!group.groupId || !group.name) {
    return null;
  }

  return {
    id: group.groupId,
    name: group.name,
    imageUrl: group.coverImageUrl ?? null,
    description: group.oneLineDescription ?? "",
    memberCount: group.memberCount ?? 0,
    reviewCount: group.reviewCount ?? 0,
    placeCount: group.placeCount ?? 0,
    matchedCount: group.matchedSavedPlaceCount ?? 0,
  };
}

export function toHomeSummary(response: HomeResponse): HomeSummary {
  return {
    nickname: response.nickname ?? "",
    myGroups: (response.myGroups ?? []).map(toMyGroup).filter((group) => group !== null),
    recommendedGroups: (response.recommendedGroups ?? [])
      .map(toRecommendedGroup)
      .filter((group) => group !== null),
  };
}

function toFeedReviewPlace(review: ReviewCardResponse): FeedReviewPlace | null {
  const place = review.place;

  if (!place?.placeId || !place.name) {
    return null;
  }

  return {
    id: place.placeId,
    name: place.name,
    roadAddress: place.roadAddress ?? "",
  };
}

function toFeedReview(review: ReviewCardResponse): FeedReview | null {
  if (!review.reviewId) {
    return null;
  }

  return {
    id: review.reviewId,
    authorNickname: review.author?.nickname ?? "",
    authorProfileImageUrl: review.author?.profileImageUrl ?? null,
    rating: review.rating ?? null,
    distanceMeters: review.distanceMeters ?? null,
    photoUrls: (review.photos ?? [])
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((photo) => photo.url)
      .filter((url) => url !== undefined),
    pros: review.aiSummary?.pros ?? null,
    cons: review.aiSummary?.cons ?? null,
    content: review.content ?? "",
    tags: (review.tags ?? [])
      .map((tag) => (tag.tagId && tag.label ? { id: tag.tagId, label: tag.label } : null))
      .filter((tag) => tag !== null),
    place: toFeedReviewPlace(review),
  };
}

export function toFeedReviews(page: CursorPageReviewCardResponse): FeedReview[] {
  return (page.items ?? []).map(toFeedReview).filter((review) => review !== null);
}
