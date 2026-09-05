import { ROUTES } from "@/shared/constants/routes";
import type { AppBottomNavValue } from "@/shared/model/appNavigation";

const BOTTOM_NAV_ROUTES: Record<AppBottomNavValue, string> = {
  home: ROUTES.ROOT,
  feed: ROUTES.FEED,
  group: ROUTES.GROUPS.ROOT,
  my: ROUTES.PROFILE.ME_REVIEWS,
};

const MY_TAB_PATHS: readonly string[] = ROUTES.PROFILE.ME_TABS.map(ROUTES.PROFILE.ME_TAB);

/** prefix 추론 대신 exact allow-list다. 하위 화면(검색·그룹 상세·티켓)은 바텀 내브가 없다. */
export function getActiveBottomNav(pathname: string): AppBottomNavValue | null {
  if (pathname === ROUTES.ROOT) return "home";
  if (pathname === ROUTES.FEED) return "feed";
  if (pathname === ROUTES.GROUPS.ROOT) return "group";
  if (MY_TAB_PATHS.includes(pathname)) return "my";
  return null;
}

export function getBottomNavHref(value: AppBottomNavValue): string {
  return BOTTOM_NAV_ROUTES[value];
}
