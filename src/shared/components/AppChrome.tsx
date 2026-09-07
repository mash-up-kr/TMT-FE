"use client";

import { usePathname } from "next/navigation";
import { getActiveBottomNav } from "@/shared/utils/bottomNavigationPolicy";
import { AppBottomNav } from "./AppBottomNav";

/** 경로만으로 표시가 결정되는 앱 chrome. 화면 상태에 따르는 하단 UI는 화면이 소유한다. */
export function AppChrome() {
  const pathname = usePathname();
  const activeBottomNav = getActiveBottomNav(pathname);

  return activeBottomNav === null ? null : <AppBottomNav activeTab={activeBottomNav} />;
}
