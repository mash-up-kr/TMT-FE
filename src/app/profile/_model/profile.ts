import { ROUTES } from "@/shared/constants/routes";

export const PROFILE_TABS = ROUTES.PROFILE.ME_TABS;

export type ProfileTab = (typeof PROFILE_TABS)[number];

export type ProfileIdentityModel = {
  nickname: string;
  profileImageUrl: string | null;
  /** 카카오 동의 항목을 못 받으면 없다. 타인 프로필에는 내려오지 않는다. */
  email?: string;
};

export type ProfileTabCounts = Record<ProfileTab, number>;

/** 타인 화면에서는 배너·하트·일치 칩이 사라지고 그룹 썸네일 크기도 달라진다. */
export type ProfileViewer = "mine" | "other";

export type ProfileGroupItem = {
  groupId: string;
  name: string;
  oneLineDescription: string;
  coverImageUrl: string | null;
  /** 조회자 기준 일치 수. 타인 프로필은 그리지 않으므로 넘기지 않는다. */
  matchedSavedPlaceCount?: number;
};

/** `saveId`는 소유자에게만 내려온다. 내 프로필만 본인 저장 상세를 열 수 있다. */
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

/** 회원가입 보상처럼 매장도 그룹도 없는 행이 있다. */
export type TicketEntrySource =
  | { kind: "place"; placeId: string; name: string; roadAddress: string }
  | { kind: "group"; groupId: string; name: string }
  | { kind: "none" };

/** "작성 중" 표시만으로 이동시키지 않도록 상태와 재개 식별자를 한 갈래로 묶는다. */
export type ProfileTicketHistoryItem = {
  entryId: string;
  type: TicketEntryType;
  source: TicketEntrySource;
  occurredAt: string;
} & ({ status: "inProgress"; saveId: string } | { status: "settled"; amount: number });

/** 화면이 받는 프로필 요약. `availableTicketCount`는 내 프로필에만 있다. */
export type ProfileSummary = {
  profile: ProfileIdentityModel;
  counts: ProfileTabCounts;
  availableTicketCount?: number;
};

export type ProfileTabPage =
  | { tab: "reviews"; items: readonly ProfileReviewItem[] }
  | { tab: "groups"; items: readonly ProfileGroupItem[] }
  | { tab: "favorites"; items: readonly ProfileFavoriteItem[] };

export type TicketHistory = {
  availableCount: number;
  items: readonly ProfileTicketHistoryItem[];
};
