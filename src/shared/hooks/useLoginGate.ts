"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared/constants/routes";
import { useAuth } from "@/shared/hooks/useAuth";
import { pathWithReturnTo } from "@/shared/utils/authNavigation";

/**
 * 공개 화면에서 로그인이 필요한 동작을 막고 로그인으로 보낸다.
 *
 * 경로는 누르는 시점에 읽는다. `useSearchParams`를 쓰면 호출하는 화면마다 Suspense 경계가 필요해진다.
 * 경로 가드와 달리 `push`로 보내 뒤로가기로 보던 화면에 돌아올 수 있게 한다.
 */
export function useLoginGate() {
  const { state } = useAuth();
  const router = useRouter();

  function redirectToLogin() {
    const { pathname, search } = window.location;
    router.push(pathWithReturnTo(ROUTES.LOGIN, `${pathname}${search}`));
  }

  return { isAuthenticated: state.status === "authenticated", redirectToLogin };
}
