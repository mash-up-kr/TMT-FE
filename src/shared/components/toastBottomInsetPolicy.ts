import { ROUTES } from "@/shared/constants/routes";

/**
 * ⚠️ UT 대비 임시 처리다. 정책이 통일되면 이 파일을 지운다.
 *
 * 토스트는 화면 아래 고정 요소(바텀 내브·하단 CTA·가입 게이트)와 자리를 다툰다. 화면마다
 * `toast.error(msg, { bottomInset: 92 })`처럼 호출부에서 값을 넘기면 같은 종류의 하단바에
 * 86·90·92가 흩어지고, 화면이 늘어날수록 빠뜨린 곳이 생긴다. 실제로 그렇게 어긋나 있었다.
 *
 * 그래서 지금은 **경로 하나만 보고** 올릴지 말지를 정한다. 호출부는 아무것도 넘기지 않는다.
 * `AppToaster`가 현재 pathname으로 이 목록을 읽어 토스트 위치를 올린다.
 *
 * 제대로 된 해결은 화면이 자기 하단 영역 높이를 알려주는 것이다(레이아웃이 소유). 그건
 * 레이아웃 계약을 바꾸는 일이라 UT 이후로 미룬다. 그때 이 파일과 `AppToaster`를 함께 지운다.
 */

/**
 * 하단 고정 요소를 피해 토스트를 띄울 높이(px).
 *
 * 요소마다 실측 높이가 다르지만(바텀 내브 86 · 하단 CTA 92 · 가입 게이트 73) 한 값으로 묶는다.
 * 값이 갈라지면 화면이 늘어날 때마다 어느 쪽인지 고르는 판단이 생기고, 그 판단이 어긋난 게
 * 원래 문제였다. 가장 높은 하단 CTA에 맞추면 나머지도 자연히 넘어간다.
 */
const TOAST_BOTTOM_INSET = 92;

/**
 * 토스트를 올려야 하는 경로. 여기 없으면 기본 위치(`--layout-floating-inset-block`)에 뜬다.
 * 하단 고정 요소가 없는 화면(가게 상세·타인 프로필·티켓 내역·검색)은 넣지 않는다.
 */
const RAISED_PATHS: readonly ((pathname: string) => boolean)[] = [
  // 바텀 내브가 있는 탭 화면
  (path) => path === ROUTES.ROOT,
  (path) => path === ROUTES.FEED,
  (path) => path === ROUTES.GROUPS.ROOT,
  // 매장 추천은 `/profile/me` 아래지만 바텀 내브가 없는 단독 화면이라 올리지 않는다.
  (path) =>
    path.startsWith(ROUTES.PROFILE.ME) &&
    path !== ROUTES.PROFILE.TICKETS &&
    path !== ROUTES.PROFILE.RECOMMEND,

  // 하단 CTA 푸터가 있는 화면
  (path) => path === ROUTES.GROUPS.NEW,
  (path) => path.startsWith("/reviews/new"),
  (path) => path.startsWith("/reviews/drafts"),

  // 그룹 상세 비회원의 가입 게이트
  (path) => /^\/groups\/[^/]+$/.test(path),

  // 프리뷰는 실제 화면을 그대로 렌더한다. 토스트를 띄우는 경로만 적는다.
  (path) => path === "/preview/groups/new",
  (path) => path === "/preview/groups/detail",
];

/** 이 경로에서 토스트를 올려야 하면 높이를, 아니면 `undefined`를 준다. */
export function resolveToastBottomInset(pathname: string): number | undefined {
  return RAISED_PATHS.some((matches) => matches(pathname)) ? TOAST_BOTTOM_INSET : undefined;
}
