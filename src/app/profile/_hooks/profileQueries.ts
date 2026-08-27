"use client";

/**
 * OpenAPI가 반영되면 각 hook의 queryFn을 생성 client 호출로 바꾸고 `_fixtures/`를 지운다.
 * 반환 타입과 mapper는 그대로이므로 Screen·컴포넌트·라우트는 건드리지 않는다.
 */

import type {
  ProfileFavoriteItem,
  ProfileGroupItem,
  ProfileIdentityModel,
  ProfileReviewItem,
  ProfileTabCounts,
  ProfileTicketHistoryItem,
} from "../_model/profile";

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

/**
 * 연동 전까지 fixture를 비동기 응답처럼 흘려보내기 위한 값이다.
 * 0이 아니면 그 시간만큼 화면이 로딩 상태로 남는다. skeleton을 눈으로 확인할 때만 잠시 올린다.
 */
const FIXTURE_DELAY_MS = 0;

export function resolveFixture<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), FIXTURE_DELAY_MS);
  });
}
