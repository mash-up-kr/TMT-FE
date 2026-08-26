"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { BottomNav, type BottomNavValue } from "@/shared/ui/BottomNav";
import { GNB } from "@/shared/ui/GNB";
import { BlankIcon } from "@/shared/ui/Icons";

/** 아직 없는 탭은 라우트가 생길 때 채운다. 매핑에 없으면 이동하지 않는다. */
const TAB_ROUTES: Partial<Record<BottomNavValue, string>> = {
  home: "/",
  feed: "/nearby",
};

type AppShellProps = {
  tab: BottomNavValue;
  children: ReactNode;
  hideNav?: boolean;
  /** 스크롤과 무관하게 콘텐츠 영역 위에 떠 있는 요소(FAB 등). */
  floating?: ReactNode;
};

export function AppShell({ tab, children, hideNav = false, floating }: AppShellProps) {
  const router = useRouter();

  return (
    <>
      <GNB align="left" className="shrink-0" title={null} left={<BlankIcon size={28} />} />
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</div>
        {floating}
      </div>
      {!hideNav && (
        <div className="flex shrink-0 justify-center px-ds-20 py-ds-12">
          <BottomNav
            value={tab}
            onValueChange={(next) => {
              const href = TAB_ROUTES[next];

              if (href) {
                router.push(href);
              }
            }}
            onCreate={() => {}}
          />
        </div>
      )}
    </>
  );
}
