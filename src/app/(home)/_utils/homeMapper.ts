import type { CursorPageReviewCardResponse } from "@/api/gen/_model/cursorPageReviewCardResponse.gen";
import type { GroupCardResponse } from "@/api/gen/_model/groupCardResponse.gen";
import type { HomeResponse } from "@/api/gen/_model/homeResponse.gen";
import type { MyGroup } from "@/api/gen/_model/myGroup.gen";
import { toReviewCardData } from "@/shared/utils/reviewMapper";
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

export function toFeedReviews(page: CursorPageReviewCardResponse): FeedReview[] {
  return page.items.map(toReviewCardData);
}
