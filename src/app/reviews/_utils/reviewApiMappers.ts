import type { AddressItem } from "@/api/gen/_model/addressItem.gen";
import type { PlaceCardResponse } from "@/api/gen/_model/placeCardResponse.gen";
import type { ReviewFormConfigResponse } from "@/api/gen/_model/reviewFormConfigResponse.gen";
import type { SaveDetailResponse } from "@/api/gen/_model/saveDetailResponse.gen";
import type { SaveListItemResponse } from "@/api/gen/_model/saveListItemResponse.gen";
import type { TagDefinition } from "@/api/gen/_model/tagDefinition.gen";
import { MAX_REVIEW_RATING } from "../_constants/review";
import { REVIEW_TAG_GROUPS } from "../_constants/tagGroups";
import type { ContinuableDraft, ReviewDraftSnapshot } from "../_model/draft";
import type { AddressSearchResult, StoreSearchResult } from "../_model/store";
import type { ReviewTag, ReviewTagGroup } from "../_model/tag";

// 스펙상 nullable인 필드가 있어 undefined와 null을 함께 받는다.
function hasText(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasFiniteNumber(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function mapStoreSearchResults(items: PlaceCardResponse[] | undefined): StoreSearchResult[] {
  return (items ?? []).flatMap((item) =>
    hasText(item.placeId) && hasText(item.name) && hasText(item.roadAddress)
      ? [{ id: item.placeId, name: item.name, address: item.roadAddress }]
      : [],
  );
}

export function mapAddressSearchResults(items: AddressItem[] | undefined): AddressSearchResult[] {
  return (items ?? []).flatMap((item) =>
    hasText(item.addressId) && hasText(item.roadAddress) && hasText(item.jibunAddress)
      ? [
          {
            addressId: item.addressId,
            roadAddress: item.roadAddress,
            jibunAddress: item.jibunAddress,
          },
        ]
      : [],
  );
}

export function mapReviewTags(tags: TagDefinition[] | undefined): ReviewTag[] {
  return (tags ?? []).flatMap((tag) =>
    hasText(tag.tagId) && hasText(tag.label) ? [{ id: tag.tagId, label: tag.label }] : [],
  );
}

export function mapReviewTagGroups(config: ReviewFormConfigResponse | undefined): ReviewTagGroup[] {
  return REVIEW_TAG_GROUPS.map(({ source, ...meta }) => ({
    ...meta,
    tags: mapReviewTags(config?.[source]),
  }));
}

export function mapContinuableDrafts(
  items: SaveListItemResponse[] | undefined,
): ContinuableDraft[] {
  return (items ?? []).flatMap((item) => {
    const placeName = item.place?.name;
    const roadAddress = item.place?.roadAddress;

    if (!hasText(item.saveId) || !hasText(placeName) || !hasText(roadAddress)) {
      return [];
    }

    return [
      {
        saveId: item.saveId,
        placeName,
        roadAddress,
        thumbnailUrl: hasText(item.thumbnailUrl) ? item.thumbnailUrl : null,
      },
    ];
  });
}

export function mapSaveDetailToDraft(save: SaveDetailResponse | undefined): ReviewDraftSnapshot {
  const placeName = save?.place?.name;
  const roadAddress = save?.place?.roadAddress;
  const placeId = save?.place?.placeId;

  const store =
    hasText(placeName) && hasText(roadAddress)
      ? {
          id: hasText(placeId) ? placeId : null,
          name: placeName,
          address: roadAddress,
          selectedAddress: null,
        }
      : null;

  const rating = save?.rating;
  const content = save?.content;

  return {
    store,
    selectedTagIds: (save?.tags ?? []).flatMap((tag) => (hasText(tag.tagId) ? [tag.tagId] : [])),
    rating:
      hasFiniteNumber(rating) && rating >= 0 && rating <= MAX_REVIEW_RATING
        ? Math.trunc(rating)
        : 0,
    reviewText: hasText(content) ? content : "",
  };
}
