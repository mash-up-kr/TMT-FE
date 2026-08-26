/**
 * 계약 응답 타입을 손으로 옮긴 것.
 *
 * 정본: [설계] API 명세 v2 — J. 마이페이지 · J-01. 타인 프로필
 * https://ttalkkak.atlassian.net/wiki/spaces/ttalkkak/pages/59310095
 *
 * OpenAPI에 반영되면 이 파일을 지우고 `src/api/gen`의 생성 타입으로 교체한다.
 * 그때 nullable·optional이 어긋나는 자리에서 타입 에러가 나는 것이 정상이며,
 * 그 자리가 곧 고칠 자리다.
 */

import type { GroupCardResponse } from "@/api/gen/_model/groupCardResponse.gen";
import type { PlaceCardResponse } from "@/api/gen/_model/placeCardResponse.gen";

export type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
  hasNext: boolean;
};

/** §2 GET /v1/users/me */
export type MeResponse = {
  userId: string;
  nickname: string;
  email: string | null;
  profileImageUrl: string | null;
  availableTicketCount: number;
  reviewCount: number;
  joinedGroupCount: number;
  favoritePlaceCount: number;
};

/** §6-2 GET /v1/users/{userId} — email·티켓이 없다 */
export type UserResponse = {
  userId: string;
  nickname: string;
  profileImageUrl: string | null;
  reviewCount: number;
  joinedGroupCount: number;
  favoritePlaceCount: number;
};

/** §3-1 · §6-3 — saveId는 소유자에게만 내려온다 */
export type ProfileReviewResponse = {
  reviewId: string;
  saveId?: string;
  thumbnailUrl: string;
  place: {
    placeId: string;
    name: string;
    categoryName: string | null;
  };
  createdAt: string;
};

/** §3-2 · §6-4 — 항목은 GroupCard 그대로 */
export type ProfileGroupResponse = GroupCardResponse;

/** §3-3 · §6-5 — 항목은 PlaceCard 그대로 */
export type ProfileFavoriteResponse = PlaceCardResponse;

/** §4-1 GET /v1/users/me/tickets */
export type TicketEntryTypeResponse =
  | "SAVE_IN_PROGRESS"
  | "SIGNUP_REWARD"
  | "REVIEW_REWARD"
  | "REVIEW_DELETE_REVOKE"
  | "GROUP_JOIN";

export type TicketEntryResponse = {
  entryId: string;
  type: TicketEntryTypeResponse;
  /** null이면 티켓이 오간 적 없는 행이고 화면이 `작성 중` 배지를 그린다 */
  amount: number | null;
  saveId: string | null;
  place: { placeId: string; name: string; roadAddress: string } | null;
  group: { groupId: string; name: string } | null;
  occurredAt: string;
};

export type TicketHistoryResponse = CursorPage<TicketEntryResponse> & {
  availableCount: number;
};
