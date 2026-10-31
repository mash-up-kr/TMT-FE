"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { ROUTES } from "@/shared/constants/routes";

/**
 * 전체 로드 이후 앱 안에서 쌓인 이동 수. 전체 로드마다 0으로 돌아간다.
 *
 * `history.length`의 절댓값은 쓸 수 없다. 새 탭·외부 링크에서도 1보다 클 수 있고, 카카오 로그인 복귀
 * 뒤에는 기록에 외부 페이지가 남아 있어 뒤로 가면 앱 밖으로 나간다. 그래서 값이 늘었는지만 본다.
 *
 * 값이 어긋날 때는 적게 세는 쪽으로 어긋난다(뒤로 간 뒤 새로 이동하면 기록 길이가 늘지 않는 경우 등).
 * 그때는 이전 화면 대신 홈으로 가므로, 앱 밖으로 나가는 것보다 안전하다.
 */
let inAppDepth = 0;

/** 앱 전체에서 한 번만 호출한다. 앱 chrome이 소유한다. */
export function useTrackInAppHistory() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const previousLength = useRef<number | null>(null);

  // popstate는 pathname 갱신보다 먼저 온다. 여기서 경로를 맞춰 두면 아래 effect는 아무것도 하지 않는다.
  useEffect(() => {
    const handlePop = () => {
      if (window.location.pathname === previousPathname.current) return;
      previousPathname.current = window.location.pathname;
      inAppDepth = Math.max(0, inAppDepth - 1);
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  useEffect(() => {
    const { length } = window.history;
    const didPush = previousLength.current !== null && length > previousLength.current;
    previousLength.current = length;
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    // replace도 pathname을 바꾸지만 기록은 늘지 않는다. 되돌아갈 화면이 생긴 이동만 센다.
    if (didPush) inAppDepth += 1;
  }, [pathname]);
}

/** 앱 안에서 이동해 왔으면 뒤로, 링크로 바로 들어왔으면 홈으로 간다. */
export function useSafeBack() {
  const router = useRouter();

  return () => {
    if (inAppDepth > 0) {
      router.back();
      return;
    }
    router.replace(ROUTES.ROOT);
  };
}
