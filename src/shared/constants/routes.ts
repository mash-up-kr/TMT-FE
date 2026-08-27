/**
 * v1 서비스 공개 pathname의 정본.
 *
 * 아직 구현되지 않은 경로도 합의된 v1 IA 기준으로 포함한다.
 * `src/app` 라우트를 추가하거나 경로를 바꿀 때 함께 갱신한다.
 * query string으로 표현되는 화면 상태는 이 상수에 포함하지 않는다.
 */

export const ROUTES = {
  ROOT: "/",
  FEED: "/feed",
  SEARCH: "/search",
  STORES: {
    DETAIL: "/stores/[storeId]",
    MENUS: "/stores/[storeId]/menus",
  },
  REVIEWS: {
    NEW: "/reviews/new",
    CONTINUE: "/reviews/continue",
    DETAIL: "/reviews/[saveId]",
    EDIT: "/reviews/[saveId]/edit",
    SHARE: "/reviews/[saveId]/share",
  },
  GROUPS: {
    ROOT: "/groups",
    NEW: "/groups/new",
    DETAIL: (groupId: string) => `/groups/${groupId}`,
    JOIN: (groupId: string) => `/groups/${groupId}/join`,
  },
  PROFILE: {
    ME: "/profile/me",
    TICKETS: "/profile/me/tickets",
    DETAIL: "/profile/[userId]",
  },
  LOGIN: "/login",
  SIGNUP: "/signup",
  ONBOARDING: "/onboarding",
} as const;
