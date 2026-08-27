"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ROUTES } from "@/shared/constants/routes";
import { BottomNav, type BottomNavValue } from "@/shared/ui/BottomNav";
import { cn } from "@/shared/utils/cn";

type TabScreenLayoutProps = {
  /** 지금 열려 있는 탭. 하단 바에서 강조된다. */
  activeTab: BottomNavValue;
  children: ReactNode;
  className?: string;
};

const TAB_ROUTES: Record<BottomNavValue, string> = {
  home: ROUTES.ROOT,
  feed: ROUTES.FEED,
  group: ROUTES.GROUPS.ROOT,
  my: ROUTES.PROFILE.ME,
};

/**
 * 하단 탭 바가 있는 화면의 껍데기.
 *
 * 탭 바는 화면 하단에 고정되고 본문만 스크롤한다. 라우트 layout이 아니라 컴포넌트로 둔 이유는
 * 같은 라우트에서도 탭 바가 사라지는 화면(검색 활성 등)이 있어서다. 감쌀지 말지를 화면이 정한다.
 */
export function TabScreenLayout({ activeTab, children, className }: TabScreenLayoutProps) {
  const router = useRouter();

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      {children}
      {/* 시안 기준 좌우 20 · 상하 12. 스크롤 영역 밖이라 항상 같은 자리에 남는다. */}
      <div className="flex shrink-0 justify-center px-ds-20 py-ds-12">
        <BottomNav
          value={activeTab}
          onValueChange={(value) => router.push(TAB_ROUTES[value])}
          onCreate={() => router.push(ROUTES.GROUPS.NEW)}
        />
      </div>
    </div>
  );
}
