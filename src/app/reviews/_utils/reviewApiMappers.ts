import type { AddressItem } from "@/api/gen/_model/addressItem.gen";
import type { PlaceCardResponse } from "@/api/gen/_model/placeCardResponse.gen";
import type { ReviewFormConfigResponse } from "@/api/gen/_model/reviewFormConfigResponse.gen";
import type { SaveDetailResponse } from "@/api/gen/_model/saveDetailResponse.gen";
import type { SaveRequest } from "@/api/gen/_model/saveRequest.gen";
import type { SaveResultResponse } from "@/api/gen/_model/saveResultResponse.gen";
import type { TagDefinition } from "@/api/gen/_model/tagDefinition.gen";
import { MAX_REVIEW_RATING } from "../_constants/review";
import { REVIEW_TAG_GROUPS } from "../_constants/tagGroups";
import type { ReviewDraftSnapshot } from "../_model/draft";
import type { ReviewSaveResult } from "../_model/save";
import type { AddressSearchResult, CompleteReviewStore, StoreSearchResult } from "../_model/store";
import type { ReviewTag, ReviewTagGroup } from "../_model/tag";

const MISSING_ADDRESS_MESSAGE =
  "매장 주소 정보가 없어 등록할 수 없어요. 매장을 다시 선택해 주세요.";
const MISSING_PLACE_MESSAGE = "저장된 매장 정보를 찾을 수 없어요. 처음부터 다시 작성해 주세요.";

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

type SaveRequestInput = Readonly<{
  store: CompleteReviewStore;
  photoAssetIds: readonly string[];
  selectedTagIds: ReadonlySet<string>;
  rating: number;
  reviewText: string;
  formConfig: ReviewFormConfigResponse;
}>;

function pickSelectedTagIds(tags: TagDefinition[], selectedTagIds: ReadonlySet<string>): string[] {
  return tags.flatMap((tag) =>
    hasText(tag.tagId) && selectedTagIds.has(tag.tagId) ? [tag.tagId] : [],
  );
}

function toPlaceFields(
  store: CompleteReviewStore,
  mode: "create" | "update",
): Pick<SaveRequest, "placeId" | "newPlace"> {
  if (hasText(store.id)) {
    return { placeId: store.id };
  }

  if (mode === "update") {
    throw new Error(MISSING_PLACE_MESSAGE);
  }

  if (store.selectedAddress === null) {
    throw new Error(MISSING_ADDRESS_MESSAGE);
  }

  return {
    newPlace: {
      name: store.name.trim(),
      addressId: store.selectedAddress.addressId,
      categoryId: null,
    },
  };
}

export function toSaveRequest(input: SaveRequestInput, mode: "create" | "update"): SaveRequest {
  const content = input.reviewText.trim();
  const fields: SaveRequest = {
    photoAssetIds: [...input.photoAssetIds],
    companionTagIds: pickSelectedTagIds(input.formConfig.companionTags, input.selectedTagIds),
    positivePointTagIds: pickSelectedTagIds(
      input.formConfig.positivePointTags,
      input.selectedTagIds,
    ),
    rating: input.rating > 0 ? input.rating : null,
    content: content.length > 0 ? content : null,
  };

  return { ...fields, ...toPlaceFields(input.store, mode) };
}

export function toReviewSaveResult(response: SaveResultResponse): ReviewSaveResult {
  return {
    saveId: response.saveId,
    reviewId: hasText(response.reviewId) ? response.reviewId : null,
    placeId: response.placeId,
    grantedTicketCount: response.ticket.grantedCount,
    availableTicketCount: response.ticket.availableCount,
  };
}
