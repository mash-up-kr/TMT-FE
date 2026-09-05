export type ReviewStore = {
  id: string | null;
  name: string;
  address: string | null;
  selectedAddress: AddressSearchResult | null;
};

export type CompleteReviewStore = ReviewStore & { address: string };

export type StoreSearchResult = {
  id: string;
  name: string;
  address: string;
};

export type AddressSearchResult = {
  /** 서버가 서명한 불투명 토큰. 해석하지 않고 저장 요청에 그대로 싣는다. */
  addressId: string;
  roadAddress: string;
  /** juso가 지번을 주지 않는 주소가 있다. */
  jibunAddress: string | null;
};
