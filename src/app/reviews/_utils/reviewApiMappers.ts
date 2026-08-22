import type { MockAddress } from "@/api/gen/_model/mockAddress.gen";
import type { PlaceCardResponse } from "@/api/gen/_model/placeCardResponse.gen";
import type { ReviewFormConfigResponse } from "@/api/gen/_model/reviewFormConfigResponse.gen";
import type { TagDefinition } from "@/api/gen/_model/tagDefinition.gen";
import { REVIEW_TAG_GROUPS } from "../_constants/tagGroups";
import type { AddressSearchResult, StoreSearchResult } from "../_model/store";
import type { ReviewTag, ReviewTagGroup } from "../_model/tag";

function hasText(value: string | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasFiniteNumber(value: number | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function mapStoreSearchResults(items: PlaceCardResponse[] | undefined): StoreSearchResult[] {
  return (items ?? []).flatMap((item) =>
    hasText(item.placeId) && hasText(item.name) && hasText(item.roadAddress)
      ? [{ id: item.placeId, name: item.name, address: item.roadAddress }]
      : [],
  );
}

export function mapAddressSearchResults(items: MockAddress[] | undefined): AddressSearchResult[] {
  return (items ?? []).flatMap((item) =>
    hasText(item.addressId) &&
    hasText(item.roadAddress) &&
    hasText(item.jibunAddress) &&
    hasFiniteNumber(item.latitude) &&
    hasFiniteNumber(item.longitude)
      ? [
          {
            addressId: item.addressId,
            roadAddress: item.roadAddress,
            jibunAddress: item.jibunAddress,
            latitude: item.latitude,
            longitude: item.longitude,
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
