import type { GroupCardResponse } from "@/api/gen/_model/groupCardResponse.gen";
import type { MyProfileResponse } from "@/api/gen/_model/myProfileResponse.gen";
import type { MyReviewGridItem } from "@/api/gen/_model/myReviewGridItem.gen";
import type { PlaceCardResponse } from "@/api/gen/_model/placeCardResponse.gen";
import type { ReviewDetailResponse } from "@/api/gen/_model/reviewDetailResponse.gen";
import type { TicketHistoryItem } from "@/api/gen/_model/ticketHistoryItem.gen";
import type { UserProfileResponse } from "@/api/gen/_model/userProfileResponse.gen";
import type { UserReviewGridItem } from "@/api/gen/_model/userReviewGridItem.gen";
import type { ReviewDetail } from "@/shared/components/ReviewDetailSheet/ReviewDetailSheet";
import type {
  ProfileFavoriteItem,
  ProfileGroupItem,
  ProfileIdentityModel,
  ProfileReviewItem,
  ProfileTabCounts,
  ProfileTicketHistoryItem,
  TicketEntrySource,
} from "../_model/profile";

export function toProfileIdentity(
  response: MyProfileResponse | UserProfileResponse,
): ProfileIdentityModel {
  return {
    nickname: response.nickname,
    profileImageUrl: response.profileImageUrl ?? null,
    ...("email" in response && response.email ? { email: response.email } : {}),
  };
}

export function toProfileTabCounts(
  response: MyProfileResponse | UserProfileResponse,
): ProfileTabCounts {
  return {
    reviews: response.reviewCount,
    groups: response.joinedGroupCount,
    favorites: response.favoritePlaceCount,
  };
}

/** `saveId`는 내 리뷰 응답에만 있다. 타인 리뷰는 저장 상세를 열 수 없다. */
export function toProfileReviewItems(
  responses: readonly (MyReviewGridItem | UserReviewGridItem)[],
): ProfileReviewItem[] {
  return responses.map((response) => ({
    reviewId: response.reviewId,
    ...("saveId" in response && response.saveId ? { saveId: response.saveId } : {}),
    thumbnailUrl: response.thumbnailUrl,
    placeId: response.place.placeId,
    placeName: response.place.name,
    categoryName: response.place.categoryName ?? null,
  }));
}

type GroupMappingOptions = {
  withMatchedCount: boolean;
};

export function toProfileGroupItems(
  responses: readonly GroupCardResponse[],
  { withMatchedCount }: GroupMappingOptions,
): ProfileGroupItem[] {
  return responses.map((response) => ({
    groupId: response.groupId,
    name: response.name,
    oneLineDescription: response.oneLineDescription,
    coverImageUrl: response.coverImageUrl ?? null,
    ...(withMatchedCount ? { matchedSavedPlaceCount: response.matchedSavedPlaceCount } : {}),
  }));
}

export function toProfileFavoriteItems(
  responses: readonly PlaceCardResponse[],
): ProfileFavoriteItem[] {
  return responses.map((response) => ({
    placeId: response.placeId,
    name: response.name,
    roadAddress: response.roadAddress,
    categoryName: response.categoryName ?? null,
    thumbnailUrl: response.thumbnailUrl ?? null,
  }));
}

function toTicketEntrySource(response: TicketHistoryItem): TicketEntrySource {
  if (response.place) {
    return {
      kind: "place",
      placeId: response.place.placeId,
      name: response.place.name,
      roadAddress: response.place.roadAddress,
    };
  }
  if (response.group) {
    return { kind: "group", groupId: response.group.groupId, name: response.group.name };
  }
  return { kind: "none" };
}

/** saveId 없는 작성 중 행은 재개할 수 없어 목록에서 제외한다. */
export function toTicketHistoryItems(
  responses: readonly TicketHistoryItem[],
): ProfileTicketHistoryItem[] {
  return responses.flatMap((response): ProfileTicketHistoryItem[] => {
    const base = {
      entryId: response.entryId,
      type: response.type,
      source: toTicketEntrySource(response),
      occurredAt: response.occurredAt,
    };

    // 티켓이 오간 적 없는 행은 amount가 null이거나 아예 내려오지 않는다.
    if (response.amount == null) {
      return response.saveId
        ? [{ ...base, status: "inProgress" as const, saveId: response.saveId }]
        : [];
    }

    return [{ ...base, status: "settled" as const, amount: response.amount }];
  });
}

export function toReviewDetail(response: ReviewDetailResponse): ReviewDetail {
  return {
    placeName: response.place.name,
    address: response.place.roadAddress,
    categoryName: response.place.categoryName ?? null,
    rating: response.rating,
    tags: response.tags.map(({ tagId, label }) => ({ id: tagId, label })),
    photos: [...response.photos]
      .sort((left, right) => left.order - right.order)
      .map(({ photoId, url }) => ({ id: photoId, url })),
    pros: response.aiSummary?.pros ?? null,
    cons: response.aiSummary?.cons ?? null,
    content: response.content,
  };
}
