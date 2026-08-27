/**
 * v1 서비스 공개 pathname의 정본.
 *
 * 아직 구현되지 않은 경로도 합의된 v1 IA 기준으로 포함한다.
 * `src/app` 라우트를 추가하거나 경로를 바꿀 때 함께 갱신한다.
 * query string으로 표현되는 화면 상태는 이 상수에 포함하지 않는다.
 */

export const ROUTES = {
  ROOT: "/",
  FEED: "/nearby",
  SEARCH: "/nearby/search",
  PLACES: {
    DETAIL: "/places/[placeId]",
    MENUS: "/places/[placeId]/menus",
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
    /** `/profile/me`는 redirect만 하는 라우트라, 이동은 기본 탭으로 직접 보낸다. */
    ME_REVIEWS: "/profile/me/reviews",
    RECOMMEND: "/profile/me/recommend",
    TICKETS: "/profile/me/tickets",
    DETAIL: "/profile/[userId]",
  },
  LOGIN: "/login",
  SIGNUP: "/signup",
  ONBOARDING: "/onboarding",
} as const;

/** 동적 세그먼트를 채워 실제 pathname을 만든다. 템플릿 문자열을 화면에 흩지 않기 위한 것이다. */
export const placeDetailPath = (placeId: string) => `/places/${placeId}`;

/** 그룹 생성 직후 상세 화면에서 최초 안내를 노출한다. */
export const groupDetailPathAfterCreate = (groupId: string) =>
  `${ROUTES.GROUPS.DETAIL(groupId)}?created=true`;

/** 검색어를 들고 피드로 돌아간다. 검색 상태는 URL이 소유한다. */
export const feedPathWithQuery = (query: string) => `${ROUTES.FEED}?q=${encodeURIComponent(query)}`;
