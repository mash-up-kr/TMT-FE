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
  addressId: string;
  roadAddress: string;
  jibunAddress: string;
  latitude: number;
  longitude: number;
};
