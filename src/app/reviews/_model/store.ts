/**
 * 리뷰에 붙는 매장. 검색으로 고르면 서버 식별자가 있고, 직접 입력하면 이름만 먼저 정해진 뒤
 * 주소를 따로 고른다. 두 경로가 같은 타입으로 모이므로 "다음" 게이트도 한 벌로 판정한다.
 */
export type ReviewStore = {
  id: string | null;
  name: string;
  address: string | null;
  selectedAddress: AddressSearchResult | null;
};

/**
 * "다음" 게이트를 통과한 매장. 다음 단계와 제출은 이 타입만 받는다.
 * 이름의 공백 여부는 타입으로 표현하지 않으므로 게이트 함수가 함께 판정한다.
 */
export type CompleteReviewStore = ReviewStore & { address: string };

export type StoreSearchResult = {
  id: string;
  name: string;
  address: string;
};

export type AddressSearchResult = {
  addressId: string;
  roadAddress: string;
  jibunAddress: string;
  latitude: number;
  longitude: number;
};
