/**
 * 리뷰에 붙는 매장. 검색으로 고르면 서버 식별자가 있고, 직접 입력하면 이름만 먼저 정해진 뒤
 * 주소를 따로 고른다. 두 경로가 같은 타입으로 모이므로 "다음" 게이트도 한 벌로 판정한다.
 */
export type ReviewStore = {
  id: string | null;
  name: string;
  address: string | null;
};

export type StoreSearchResult = {
  id: string;
  name: string;
  address: string;
};

export type AddressSearchResult = {
  id: string;
  roadAddress: string;
  jibunAddress: string;
};
