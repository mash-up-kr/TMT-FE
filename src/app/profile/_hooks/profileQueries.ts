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

/** fixture가 즉시 반환되면 skeleton을 볼 수 없어 한 박자 늦춘다. */
const FIXTURE_DELAY_MS = 250;

export function resolveFixture<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), FIXTURE_DELAY_MS);
  });
}
