export const PROFILE_TABS = ["reviews", "groups", "favorites"] as const;

export type ProfileTab = (typeof PROFILE_TABS)[number];

export type ProfileIdentityModel = {
  nickname: string;
  imageUrl: string | null;
  email?: string;
};

export type ProfileTabCounts = Record<ProfileTab, number>;

export type ProfileGroupItem = {
  groupId: string;
  name: string;
  description: string;
  imageUrl: string | null;
  /** 내가 저장한 가게와 겹치는 수. 0이면 뱃지가 사라진다. */
  matchedSavedPlaceCount: number;
};

/**
 * 티켓 증감 이력 한 줄.
 *
 * 작성 중 항목은 `draftId`가 있을 때만 재개 경로를 가진다. "작성 중"이라는 표시만으로
 * 이동시키지 않기 위해 상태와 식별자를 한 갈래로 묶는다.
 */
export type ProfileTicketHistoryItem = {
  id: string;
  placeName: string;
  address: string;
} & ({ status: "draft"; draftId: string } | { status: "settled"; delta: number });

export type ProfileFavoriteItem = {
  placeId: string;
  name: string;
  roadAddress: string;
  categoryName: string | null;
  thumbnailUrl: string | null;
};
