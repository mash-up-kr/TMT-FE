import { ROUTES } from "@/shared/constants/routes";

type BottomNavigationPolicyEntry = {
  value: string;
  href: string;
  /** 대표 경로 외에도 활성화되는 exact pathname 목록. */
  activePaths?: readonly string[];
};

const BOTTOM_NAV_POLICY = [
  { value: "home", href: ROUTES.ROOT },
  { value: "feed", href: ROUTES.FEED },
  { value: "group", href: ROUTES.GROUPS.ROOT },
  {
    value: "my",
    href: ROUTES.PROFILE.ME_REVIEWS,
    activePaths: ROUTES.PROFILE.ME_TABS.map(ROUTES.PROFILE.ME_TAB),
  },
] as const satisfies readonly BottomNavigationPolicyEntry[];

export type AppBottomNavValue = (typeof BOTTOM_NAV_POLICY)[number]["value"];

function isActivePath(policy: BottomNavigationPolicyEntry, pathname: string): boolean {
  return policy.activePaths?.includes(pathname) ?? pathname === policy.href;
}

/** prefix 추론 대신 exact allow-list다. 하위 화면(검색·그룹 상세·티켓)은 바텀 내브가 없다. */
export function getActiveBottomNav(pathname: string): AppBottomNavValue | null {
  const policy = BOTTOM_NAV_POLICY.find((entry) => isActivePath(entry, pathname));

  return policy?.value ?? null;
}

export function getBottomNavHref(value: AppBottomNavValue): string {
  const policy = BOTTOM_NAV_POLICY.find((entry) => entry.value === value);

  if (policy === undefined) {
    throw new Error(`Unknown bottom navigation value: ${value}`);
  }

  return policy.href;
}
