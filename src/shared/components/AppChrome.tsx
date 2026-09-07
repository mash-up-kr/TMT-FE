"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { getActiveBottomNav } from "@/shared/utils/bottomNavigationPolicy";
import { cn } from "@/shared/utils/cn";
import { AppBottomNav } from "./AppBottomNav";

/**
 * 경로만으로 표시가 결정되는 앱 chrome. 화면 상태에 따르는 하단 UI는 화면이 소유한다.
 *
 * 바텀 내브는 오버레이라 본문 높이를 줄이지 않는다. 대신 여기서 점유 높이를
 * `bottom-navigation-inset`으로 선언하고, 내브 뒤로 흐르는 요소가 `scroll-under-navigation`으로
 * 그 값을 되돌려 받는다. 화면이 children으로 들어오는 건 그 선언을 상속시키기 위해서다.
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
      {children}
      {activeBottomNav === null ? null : <AppBottomNav activeTab={activeBottomNav} />}
    </div>
  );
}
