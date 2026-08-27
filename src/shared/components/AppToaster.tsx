"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "@/shared/ui/Toast";
import { resolveToastBottomInset } from "./toastBottomInsetPolicy";

/**
 * ⚠️ UT 대비 임시 처리다. `toastBottomInsetPolicy`와 함께 지운다.
 *
 * 토스트 자리를 경로로 정하기 위한 얇은 껍데기. `Toaster`는 root layout에 하나뿐이라
 * 화면이 스스로 값을 넘길 수 없어서, 여기서 pathname을 읽어 대신 넘긴다.
 *
 * 경로가 바뀌면 떠 있던 토스트도 새 화면 기준으로 따라 올라간다. 토스트를 띄우고 곧바로
 * 이동하는 흐름(그룹 생성·탈퇴)에서 이전 화면 기준 높이로 남지 않게 하려는 것이다.
 */
export function AppToaster() {
  const pathname = usePathname();

  return <Toaster bottomInset={resolveToastBottomInset(pathname)} />;
}
