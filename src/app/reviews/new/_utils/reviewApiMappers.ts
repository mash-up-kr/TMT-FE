import type { MockAddress } from "@/api/gen/_model/mockAddress.gen";
import type { PlaceCardResponse } from "@/api/gen/_model/placeCardResponse.gen";
import type { TagDefinition } from "@/api/gen/_model/tagDefinition.gen";
import type { AddressSearchResult, StoreSearchResult } from "../_model/store";
import type { ReviewTag } from "../_model/tag";

function hasText(value: string | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
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
    hasText(item.addressId) && hasText(item.roadAddress) && hasText(item.jibunAddress)
      ? [{ id: item.addressId, roadAddress: item.roadAddress, jibunAddress: item.jibunAddress }]
      : [],
  );
}

export function mapReviewTags(tags: TagDefinition[] | undefined): ReviewTag[] {
  return (tags ?? []).flatMap((tag) =>
    hasText(tag.tagId) && hasText(tag.label) ? [{ id: tag.tagId, label: tag.label }] : [],
  );
}
