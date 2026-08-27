"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ROUTES } from "@/shared/constants/routes";
import { BottomNav, type BottomNavValue } from "@/shared/ui/BottomNav";
import { GNB } from "@/shared/ui/GNB";
import { BlankIcon } from "@/shared/ui/Icons";

const TAB_ROUTES: Record<BottomNavValue, string> = {
  home: ROUTES.ROOT,
  feed: ROUTES.FEED,
  group: ROUTES.GROUPS.ROOT,
  my: ROUTES.PROFILE.ME,
};

type AppShellProps = {
  tab: BottomNavValue;
  children: ReactNode;
  /** 스크롤과 무관하게 콘텐츠 영역 위에 떠 있는 요소(FAB 등). */
  floating?: ReactNode;
};

export function AppShell({ tab, children, floating }: AppShellProps) {
  const router = useRouter();

  return (
    <>
      <GNB align="left" className="shrink-0" title={null} left={<BlankIcon size={28} />} />
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</div>
        {floating}
      </div>
      <div className="flex shrink-0 justify-center px-ds-20 py-ds-12">
        <BottomNav
          value={tab}
          onValueChange={(next) => router.push(TAB_ROUTES[next])}
          onCreate={() => {}}
        />
      </div>
    </>
  );
}
