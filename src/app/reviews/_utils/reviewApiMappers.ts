import type { MockAddress } from "@/api/gen/_model/mockAddress.gen";
import type { PlaceCardResponse } from "@/api/gen/_model/placeCardResponse.gen";
import type { ReviewFormConfigResponse } from "@/api/gen/_model/reviewFormConfigResponse.gen";
import type { SaveDetailResponse } from "@/api/gen/_model/saveDetailResponse.gen";
import type { TagDefinition } from "@/api/gen/_model/tagDefinition.gen";
import { MAX_REVIEW_RATING } from "../_constants/review";
import { REVIEW_TAG_GROUPS } from "../_constants/tagGroups";
import type { ReviewDraftSnapshot } from "../_model/draft";
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

/**
 * 서버 초안을 이어쓰기 진입값으로 바꾼다.
 *
 * 응답의 모든 필드가 optional이라 값이 비어 있을 수 있다. 매장 이름이나 주소가 없으면 매장을
 * `null`로 두어 초안 가드가 1단계로 되돌리게 한다 — 반쯤 채워진 매장으로 다음 단계를 열면
 * 무엇을 고쳐야 하는지 알 수 없다.
 *
 * `selectedAddress`는 주소 검색으로 고른 좌표·지번까지 담는 값이라 초안 응답만으로는 복원할 수
 * 없다. 표시용 주소만 채우고 `null`로 둔다.
 *
 * 사진은 담지 않는다. 이유는 `ReviewDraftSnapshot` 주석 참고.
 */
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
