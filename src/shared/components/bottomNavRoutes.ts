import { ROUTES } from "@/shared/constants/routes";
import type { BottomNavValue } from "@/shared/ui/BottomNav";

/** 하단 탭 바를 쓰는 모든 레이아웃이 공유하는 목적지. 레이아웃마다 따로 두면 경로가 어긋난다. */
export const BOTTOM_NAV_ROUTES: Record<BottomNavValue, string> = {
  home: ROUTES.ROOT,
  feed: ROUTES.FEED,
  group: ROUTES.GROUPS.ROOT,
  my: ROUTES.PROFILE.ME_REVIEWS,
};
