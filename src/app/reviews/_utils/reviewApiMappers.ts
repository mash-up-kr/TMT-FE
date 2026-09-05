import type { AddressItem } from "@/api/gen/_model/addressItem.gen";
import type { PlaceCardResponse } from "@/api/gen/_model/placeCardResponse.gen";
import type { ReviewFormConfigResponse } from "@/api/gen/_model/reviewFormConfigResponse.gen";
import type { SaveCreateRequest } from "@/api/gen/_model/saveCreateRequest.gen";
import type { SaveDetailResponse } from "@/api/gen/_model/saveDetailResponse.gen";
import type { SaveListItemResponse } from "@/api/gen/_model/saveListItemResponse.gen";
import type { SaveResultResponse } from "@/api/gen/_model/saveResultResponse.gen";
import type { TagDefinition } from "@/api/gen/_model/tagDefinition.gen";
import { MAX_REVIEW_RATING } from "../_constants/review";
import { REVIEW_TAG_GROUPS } from "../_constants/tagGroups";
import type { ContinuableDraft, ReviewDraftSnapshot } from "../_model/draft";
import type { ReviewSaveResult } from "../_model/save";
import type { AddressSearchResult, StoreSearchResult } from "../_model/store";
import type { ReviewTag, ReviewTagGroup } from "../_model/tag";

// 스펙상 nullable인 필드가 있어 undefined와 null을 함께 받는다.
function hasText(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasFiniteNumber(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

type ReviewTagConfig = Pick<ReviewFormConfigResponse, "companionTags" | "positivePointTags">;

export class ReviewSaveMappingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReviewSaveMappingError";
  }
}

function mapReviewFields(
  draft: ReviewDraftSnapshot,
  config: ReviewTagConfig,
  photoAssetIds?: readonly string[],
): Omit<SaveCreateRequest, "placeId" | "newPlace"> {
  const companionTagIds = new Set(config.companionTags.map((tag) => tag.tagId));
  const positivePointTagIds = new Set(config.positivePointTags.map((tag) => tag.tagId));
  const unknownTagIds = draft.selectedTagIds.filter(
    (id) => !companionTagIds.has(id) && !positivePointTagIds.has(id),
  );

  if (unknownTagIds.length > 0) {
    throw new ReviewSaveMappingError("선택한 태그 정보를 확인하지 못했어요. 다시 시도해 주세요");
  }

  return {
    ...(photoAssetIds === undefined ? {} : { photoAssetIds: [...photoAssetIds] }),
    companionTagIds: draft.selectedTagIds.filter((id) => companionTagIds.has(id)),
    positivePointTagIds: draft.selectedTagIds.filter((id) => positivePointTagIds.has(id)),
    rating: draft.rating > 0 ? draft.rating : null,
    content: hasText(draft.reviewText) ? draft.reviewText : null,
  };
}

export function toCreateSaveRequest(
  draft: ReviewDraftSnapshot,
  config: ReviewTagConfig,
  photoAssetIds?: readonly string[],
): SaveCreateRequest {
  if (draft.store === null) {
    throw new ReviewSaveMappingError("매장 정보를 확인해 주세요");
  }

  const fields = mapReviewFields(draft, config, photoAssetIds);

  if (hasText(draft.store.id)) {
    return { placeId: draft.store.id, ...fields };
  }

  if (draft.store.selectedAddress === null) {
    throw new ReviewSaveMappingError("매장 주소를 다시 선택해 주세요");
  }

  return {
    newPlace: {
      name: draft.store.name,
      addressId: draft.store.selectedAddress.addressId,
    },
    ...fields,
  };
}

export function toUpdateSaveRequest(
  draft: ReviewDraftSnapshot,
  config: ReviewTagConfig,
  photoAssetIds?: readonly string[],
): SaveCreateRequest {
  if (draft.store === null || !hasText(draft.store.id)) {
    throw new ReviewSaveMappingError("저장된 매장 정보를 확인하지 못했어요");
  }

  return { placeId: draft.store.id, ...mapReviewFields(draft, config, photoAssetIds) };
}

export function isResumableSaveDetail(save: Pick<SaveDetailResponse, "photos">): boolean {
  return save.photos.length === 0;
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
    hasText(item.addressId) && hasText(item.roadAddress)
      ? [
          {
            addressId: item.addressId,
            roadAddress: item.roadAddress,
            jibunAddress: hasText(item.jibunAddress) ? item.jibunAddress : null,
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
        canContinue: !hasText(item.thumbnailUrl),
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

export function toReviewSaveResult(response: SaveResultResponse): ReviewSaveResult {
  return {
    saveId: response.saveId,
    reviewId: hasText(response.reviewId) ? response.reviewId : null,
    placeId: response.placeId,
    grantedTicketCount: response.ticket.grantedCount,
    availableTicketCount: response.ticket.availableCount,
  };
}
