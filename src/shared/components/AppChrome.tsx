"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { getActiveBottomNav } from "@/shared/utils/bottomNavigationPolicy";
import { cn } from "@/shared/utils/cn";
import { AppBottomNav } from "./AppBottomNav";

/**
 * 경로만으로 표시가 결정되는 앱 chrome. 화면 상태에 따르는 하단 UI는 화면이 소유한다.
 *
 * 바텀 내브는 오버레이라 여기서만 콘텐츠 슬롯에 점유 높이를 예약한다. 화면은 내비 존재나
 * 여백을 알 필요가 없다.
 */
export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const activeBottomNav = getActiveBottomNav(pathname);

  return (
    <div
      className={cn(
        "relative flex min-h-0 flex-1 flex-col",
        activeBottomNav !== null && "bottom-navigation-inset",
      )}
    >
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          activeBottomNav !== null && "scroll-under-navigation",
        )}
      >
        {children}
      </div>
      {activeBottomNav === null ? null : <AppBottomNav activeTab={activeBottomNav} />}
    </div>
  );
}
