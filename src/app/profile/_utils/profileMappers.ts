import type {
  MeResponse,
  ProfileFavoriteResponse,
  ProfileGroupResponse,
  ProfileReviewResponse,
  TicketEntryResponse,
  UserResponse,
} from "../_fixtures/contract";
import type {
  ProfileFavoriteItem,
  ProfileGroupItem,
  ProfileIdentityModel,
  ProfileReviewItem,
  ProfileTabCounts,
  ProfileTicketHistoryItem,
  TicketEntrySource,
} from "../_model/profile";

export function toProfileIdentity(response: MeResponse | UserResponse): ProfileIdentityModel {
  return {
    nickname: response.nickname,
    profileImageUrl: response.profileImageUrl,
    ...("email" in response && response.email ? { email: response.email } : {}),
  };
}

export function toProfileTabCounts(response: MeResponse | UserResponse): ProfileTabCounts {
  return {
    reviews: response.reviewCount,
    groups: response.joinedGroupCount,
    favorites: response.favoritePlaceCount,
  };
}

export function toProfileReviewItems(
  responses: readonly ProfileReviewResponse[],
): ProfileReviewItem[] {
  return responses.map((response) => ({
    reviewId: response.reviewId,
    ...(response.saveId ? { saveId: response.saveId } : {}),
    thumbnailUrl: response.thumbnailUrl,
    placeId: response.place.placeId,
    placeName: response.place.name,
    categoryName: response.place.categoryName,
  }));
}

type GroupMappingOptions = {
  withMatchedCount: boolean;
};

export function toProfileGroupItems(
  responses: readonly ProfileGroupResponse[],
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
  responses: readonly ProfileFavoriteResponse[],
): ProfileFavoriteItem[] {
  return responses.map((response) => ({
    placeId: response.placeId,
    name: response.name,
    roadAddress: response.roadAddress,
    categoryName: response.categoryName ?? null,
    thumbnailUrl: response.thumbnailUrl ?? null,
  }));
}

function toTicketEntrySource(response: TicketEntryResponse): TicketEntrySource {
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
  responses: readonly TicketEntryResponse[],
): ProfileTicketHistoryItem[] {
  return responses.flatMap((response): ProfileTicketHistoryItem[] => {
    const base = {
      entryId: response.entryId,
      type: response.type,
      source: toTicketEntrySource(response),
      occurredAt: response.occurredAt,
    };

    if (response.amount === null) {
      return response.saveId
        ? [{ ...base, status: "inProgress" as const, saveId: response.saveId }]
        : [];
    }

    return [{ ...base, status: "settled" as const, amount: response.amount }];
  });
}
