"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { TMTLogoHomeLink } from "@/shared/components/TMTLogoHomeLink";
import { BottomNav, type BottomNavValue } from "@/shared/ui/BottomNav";
import { GNB } from "@/shared/ui/GNB";
import { BOTTOM_NAV_ROUTES } from "../bottomNavRoutes";

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
      <GNB align="left" className="shrink-0" title={null} left={<TMTLogoHomeLink />} />
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</div>
        {floating}
      </div>
      <div className="flex shrink-0 justify-center px-ds-20 py-ds-12">
        <BottomNav
          value={tab}
          onValueChange={(next) => router.push(BOTTOM_NAV_ROUTES[next])}
          onCreate={() => {}}
        />
      </div>
    </>
  );
}
