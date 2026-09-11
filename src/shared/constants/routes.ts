/**
 * v1 서비스 공개 pathname의 정본.
 *
 * 아직 구현되지 않은 경로도 합의된 v1 IA 기준으로 포함한다.
 * `src/app` 라우트를 추가하거나 경로를 바꿀 때 함께 갱신한다.
 * query string으로 표현되는 화면 상태는 이 상수에 포함하지 않는다.
 */

/** 마이페이지 탭 세그먼트. 탭 화면·바텀 내브 정책·이어쓰기 안내가 같은 목록을 본다. */
const PROFILE_ME_TABS = ["reviews", "groups", "favorites"] as const;

export const ROUTES = {
  ROOT: "/",
  FEED: "/feed",
  PLACES: {
    DETAIL: "/places/[placeId]",
    MENUS: "/places/[placeId]/menus",
  },
  REVIEWS: {
    /** 초안 목록. 쓰다 만 리뷰를 고르는 화면이다. */
    DRAFTS: "/reviews/drafts",
    /** 새 리뷰의 첫 화면(매장 검색). 아직 초안이 없어 id 자리에 `new`가 온다. */
    NEW: "/reviews/drafts/new",
    /** 작성 중인 초안의 흐름 진입점. 단계 세그먼트는 reviews 라우트가 붙인다. */
    DRAFT: (draftId: string) => `/reviews/drafts/${draftId}`,
    DETAIL: "/reviews/[saveId]",
    EDIT: "/reviews/[saveId]/edit",
    SHARE: "/reviews/[saveId]/share",
  },
  GROUPS: {
    ROOT: "/groups",
    NEW: "/groups/new",
    DETAIL: (groupId: string) => `/groups/${groupId}`,
    EDIT: (groupId: string) => `/groups/${groupId}/edit`,
    JOIN: (groupId: string) => `/groups/${groupId}/join`,
    SHARE: (groupId: string) => `/groups/${groupId}/share`,
  },
  PROFILE: {
    ME: "/profile/me",
    /** `/profile/me`는 redirect만 하는 라우트라, 이동은 기본 탭으로 직접 보낸다. */
    ME_REVIEWS: `/profile/me/${PROFILE_ME_TABS[0]}`,
    ME_TABS: PROFILE_ME_TABS,
    ME_TAB: (tab: string) => `/profile/me/${tab}`,
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

export const userProfilePath = (userId: string) => `/profile/${userId}`;
