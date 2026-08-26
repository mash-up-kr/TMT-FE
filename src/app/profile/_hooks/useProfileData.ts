"use client";

/**
 * 프로필 화면의 데이터 출처. **연동 시 교체하는 유일한 지점이다.**
 *
 * 지금은 `_fixtures/`의 계약 응답을 react-query로 감싸 돌려준다.
 * OpenAPI가 반영되면 각 queryFn을 생성 client 호출로 바꾸고 `_fixtures/`를 지운다.
 * 반환 타입과 mapper는 그대로 두므로 Screen·컴포넌트·라우트는 건드리지 않는다.
 *
 * 목록은 연동 시 `useInfiniteQuery`로 바뀐다. 지금은 커서가 한 장이라 `useQuery`로 둔다.
 */

import { useQuery } from "@tanstack/react-query";
import type { CursorPage } from "../_fixtures/contract";
import * as fixtures from "../_fixtures/profileFixtures";
import type {
  ProfileFavoriteItem,
  ProfileGroupItem,
  ProfileIdentityModel,
  ProfileReviewItem,
  ProfileTab,
  ProfileTabCounts,
  ProfileTicketHistoryItem,
} from "../_model/profile";
import {
  toProfileFavoriteItems,
  toProfileGroupItems,
  toProfileIdentity,
  toProfileReviewItems,
  toProfileTabCounts,
  toTicketHistoryItems,
} from "../_utils/profileMappers";

/** fixture가 즉시 반환되면 skeleton을 볼 수 없어, 화면 확인용으로 한 박자 늦춘다. */
const FIXTURE_DELAY_MS = 250;

function resolveFixture<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), FIXTURE_DELAY_MS);
  });
}

export type ProfileSummary = {
  profile: ProfileIdentityModel;
  counts: ProfileTabCounts;
  availableTicketCount?: number;
};

export type ProfileTabPage =
  | { tab: "reviews"; items: readonly ProfileReviewItem[] }
  | { tab: "groups"; items: readonly ProfileGroupItem[] }
  | { tab: "favorites"; items: readonly ProfileFavoriteItem[] };

export function useMyProfileSummary() {
  return useQuery({
    queryKey: ["profile", "me", "summary"],
    queryFn: async (): Promise<ProfileSummary> => {
      const response = await resolveFixture(fixtures.ME);
      return {
        profile: toProfileIdentity(response),
        counts: toProfileTabCounts(response),
        availableTicketCount: response.availableTicketCount,
      };
    },
  });
}

export function useUserProfileSummary(userId: string) {
  return useQuery({
    queryKey: ["profile", userId, "summary"],
    queryFn: async (): Promise<ProfileSummary> => {
      const response = await resolveFixture(fixtures.OTHER_USER);
      return {
        profile: toProfileIdentity(response),
        counts: toProfileTabCounts(response),
      };
    },
  });
}

type TabFixtures = {
  reviews: typeof fixtures.MY_REVIEWS;
  groups: typeof fixtures.MY_GROUPS;
  favorites: typeof fixtures.MY_FAVORITES;
};

const MY_TAB_FIXTURES: TabFixtures = {
  reviews: fixtures.MY_REVIEWS,
  groups: fixtures.MY_GROUPS,
  favorites: fixtures.MY_FAVORITES,
};

const OTHER_TAB_FIXTURES: TabFixtures = {
  reviews: fixtures.OTHER_REVIEWS,
  groups: fixtures.OTHER_GROUPS,
  favorites: fixtures.OTHER_FAVORITES,
};

function toTabPage(
  tab: ProfileTab,
  source: TabFixtures,
  { isMine }: { isMine: boolean },
): ProfileTabPage {
  switch (tab) {
    case "reviews":
      return { tab, items: toProfileReviewItems(source.reviews.items) };
    case "groups":
      return {
        tab,
        items: toProfileGroupItems(source.groups.items, { withMatchedCount: isMine }),
      };
    case "favorites":
      return { tab, items: toProfileFavoriteItems(source.favorites.items) };
  }
}

export function useMyProfileTabPage(tab: ProfileTab) {
  return useQuery({
    queryKey: ["profile", "me", tab],
    queryFn: async (): Promise<ProfileTabPage> => {
      await resolveFixture(null);
      return toTabPage(tab, MY_TAB_FIXTURES, { isMine: true });
    },
  });
}

export function useUserProfileTabPage(userId: string, tab: ProfileTab) {
  return useQuery({
    queryKey: ["profile", userId, tab],
    queryFn: async (): Promise<ProfileTabPage> => {
      await resolveFixture(null);
      return toTabPage(tab, OTHER_TAB_FIXTURES, { isMine: false });
    },
  });
}

export type TicketHistory = {
  availableCount: number;
  items: readonly ProfileTicketHistoryItem[];
};

export function useTicketHistory() {
  return useQuery({
    queryKey: ["profile", "me", "tickets"],
    queryFn: async (): Promise<TicketHistory> => {
      const response = await resolveFixture(fixtures.MY_TICKETS);
      return {
        availableCount: response.availableCount,
        items: toTicketHistoryItems(response.items),
      };
    },
  });
}

/** 목록 응답의 커서 필드를 지금은 쓰지 않지만, 교체 시점에 필요한 형태를 남겨둔다. */
export type { CursorPage };
