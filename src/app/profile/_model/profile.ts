export const PROFILE_TABS = ["reviews", "groups", "favorites"] as const;

export type ProfileTab = (typeof PROFILE_TABS)[number];

export type ProfileIdentityModel = {
  nickname: string;
  profileImageUrl: string | null;
  /** 카카오 동의 항목을 못 받으면 없다. 타인 프로필에는 내려오지 않는다. */
  email?: string;
};

export type ProfileTabCounts = Record<ProfileTab, number>;

export type ProfileGroupItem = {
  groupId: string;
  name: string;
  oneLineDescription: string;
  coverImageUrl: string | null;
  /** 조회자 기준 일치 수. 타인 프로필은 그리지 않으므로 넘기지 않는다. */
  matchedSavedPlaceCount?: number;
};

/**
 * 리뷰 탭 2열 그리드의 한 칸. 카드가 아니라 썸네일만 그린다.
 *
 * `saveId`는 소유자에게만 내려온다. 내 프로필은 본인 저장 상세를, 타인 프로필은
 * 리뷰 상세를 여는 갈래가 여기서 갈린다.
 */
export type ProfileReviewItem = {
  reviewId: string;
  saveId?: string;
  thumbnailUrl: string;
  placeId: string;
  placeName: string;
  categoryName: string | null;
};

export type ProfileFavoriteItem = {
  placeId: string;
  name: string;
  roadAddress: string;
  categoryName: string | null;
  thumbnailUrl: string | null;
};

export const TICKET_ENTRY_TYPES = [
  "SAVE_IN_PROGRESS",
  "SIGNUP_REWARD",
  "REVIEW_REWARD",
  "REVIEW_DELETE_REVOKE",
  "GROUP_JOIN",
] as const;

export type TicketEntryType = (typeof TICKET_ENTRY_TYPES)[number];

/**
 * 티켓 이력 행의 출처. 매장에서 온 것, 그룹에서 온 것, 어느 쪽도 아닌 것 셋이다.
 * 회원가입 보상은 매장도 그룹도 없다.
 */
export type TicketEntrySource =
  | { kind: "place"; placeId: string; name: string; roadAddress: string }
  | { kind: "group"; groupId: string; name: string }
  | { kind: "none" };

/**
 * 티켓 증감 이력 한 줄. 발급·소비·회수와 아직 티켓이 오가지 않은 저장이 한 목록에 섞인다.
 *
 * 상태는 응답의 amount가 null인지로 갈린다. 재개 핸들은 saveId이며,
 * "작성 중" 표시만으로 이동시키지 않기 위해 상태와 식별자를 한 갈래로 묶는다.
 */
export type ProfileTicketHistoryItem = {
  entryId: string;
  type: TicketEntryType;
  source: TicketEntrySource;
  occurredAt: string;
} & ({ status: "inProgress"; saveId: string } | { status: "settled"; amount: number });
