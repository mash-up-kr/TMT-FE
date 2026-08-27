/**
 * 계약 응답 타입을 손으로 옮긴 것. 정본은 Confluence의 API 명세 v2다.
 * https://ttalkkak.atlassian.net/wiki/spaces/ttalkkak/pages/59310095
 *
 * OpenAPI에 반영되면 이 파일을 지우고 생성 타입으로 교체한다.
 * 그때 나는 타입 에러가 곧 고칠 자리다.
 */

import type { GroupCardResponse } from "@/api/gen/_model/groupCardResponse.gen";
import type { PlaceCardResponse } from "@/api/gen/_model/placeCardResponse.gen";

export type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
  hasNext: boolean;
};

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

/** 타인 프로필. email·티켓이 없다. */
export type UserResponse = {
  userId: string;
  nickname: string;
  profileImageUrl: string | null;
  reviewCount: number;
  joinedGroupCount: number;
  favoritePlaceCount: number;
};

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

export type ProfileGroupResponse = GroupCardResponse;

export type ProfileFavoriteResponse = PlaceCardResponse;

export type TicketEntryTypeResponse =
  | "SAVE_IN_PROGRESS"
  | "SIGNUP_REWARD"
  | "REVIEW_REWARD"
  | "REVIEW_DELETE_REVOKE"
  | "GROUP_JOIN";

export type TicketEntryResponse = {
  entryId: string;
  type: TicketEntryTypeResponse;
  /** null이면 티켓이 오간 적 없는 행이다. */
  amount: number | null;
  saveId: string | null;
  place: { placeId: string; name: string; roadAddress: string } | null;
  group: { groupId: string; name: string } | null;
  occurredAt: string;
};

export type TicketHistoryResponse = CursorPage<TicketEntryResponse> & {
  availableCount: number;
};
