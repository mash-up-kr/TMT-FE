import type { CursorPageReviewCardResponse } from "@/api/gen/_model/cursorPageReviewCardResponse.gen";
import type { GroupCardResponse } from "@/api/gen/_model/groupCardResponse.gen";
import type { HomeResponse } from "@/api/gen/_model/homeResponse.gen";
import type { MyGroup } from "@/api/gen/_model/myGroup.gen";
import type { ReviewCardResponse } from "@/api/gen/_model/reviewCardResponse.gen";
import type { FeedReview, HomeGroup, HomeRecommendedGroup, HomeSummary } from "../_model/home";

function toMyGroup(group: MyGroup): HomeGroup {
  return {
    id: group.groupId,
    name: group.name,
    imageUrl: group.imageUrl ?? null,
  };
}

function toRecommendedGroup(group: GroupCardResponse): HomeRecommendedGroup {
  return {
    id: group.groupId,
    name: group.name,
    imageUrl: group.coverImageUrl ?? null,
    description: group.oneLineDescription,
    memberCount: group.memberCount,
    reviewCount: group.reviewCount,
    placeCount: group.placeCount,
    matchedCount: group.matchedSavedPlaceCount,
  };
}

export function toHomeSummary(response: HomeResponse): HomeSummary {
  return {
    nickname: response.nickname,
    myGroups: response.myGroups.map(toMyGroup),
    recommendedGroups: response.recommendedGroups.map(toRecommendedGroup),
  };
}

function toFeedReview(review: ReviewCardResponse): FeedReview {
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
    },
  };
}

export function toFeedReviews(page: CursorPageReviewCardResponse): FeedReview[] {
  return page.items.map(toFeedReview);
}
