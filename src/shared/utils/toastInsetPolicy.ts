import { ROUTES } from "@/shared/constants/routes";
import { getActiveBottomNav } from "./bottomNavigationPolicy";

/** 하단 요소(내브 86 · CTA 92 · 가입 게이트 73) 중 최댓값 하나로 통일한다. */
const TOAST_BOTTOM_INSET = 92;

/**
 * 경로만으로 판별되는 하단 고정 요소(CTA·가입 게이트).
 * ponytail: 그룹 상세 가입 게이트는 멤버십에 따라 갈리지만 경로로 근사한다. 런타임 상태로
 * 갈리는 하단 요소가 더 생기면 화면이 점유 높이를 선언하는 계약으로 교체한다.
 */
function hasStaticBottomOverlay(pathname: string): boolean {
  return (
    pathname === ROUTES.GROUPS.NEW ||
    pathname.startsWith(ROUTES.REVIEWS.NEW) ||
    pathname.startsWith(ROUTES.REVIEWS.DRAFTS) ||
    /^\/groups\/[^/]+$/.test(pathname)
  );
}

/** 프리뷰는 실제 화면을 그대로 그린다. 토스트를 띄우는 프리뷰만 적고, 프리뷰가 사라질 때 함께 지운다. */
const PREVIEW_RAISED_PATHS: readonly string[] = ["/preview/groups/new", "/preview/groups/detail"];

export function resolveToastBottomInset(pathname: string): number | undefined {
  const raised =
    getActiveBottomNav(pathname) !== null ||
    hasStaticBottomOverlay(pathname) ||
    PREVIEW_RAISED_PATHS.includes(pathname);

  return raised ? TOAST_BOTTOM_INSET : undefined;
}
