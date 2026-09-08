"use client";

import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useSyncExternalStore } from "react";
import {
  announceLogin,
  connectSessionChannel,
  getServerSessionSnapshot,
  getSessionSnapshot,
  logoutSession,
  refreshSession,
  subscribeSession,
} from "@/api/auth-session";
import type { MyProfileResponse } from "@/api/gen/_model/myProfileResponse.gen";
import { useMe } from "@/api/gen/profile/profile.gen";
import { getTmtApiErrorCode, TmtApiError } from "@/api/mutator";
import { ErrorFallback } from "@/shared/components/ErrorFallback";
import { ROUTES } from "@/shared/constants/routes";
import { AuthContext } from "@/shared/providers/AuthContext";
import { Spinner } from "@/shared/ui/Spinner";
import { isPublicPage, safeReturnTo } from "@/shared/utils/authNavigation";

function selectProfileCompleted(profile: MyProfileResponse): boolean {
  if (typeof profile.profileCompleted !== "boolean") {
    throw new Error("가입 상태 응답이 올바르지 않습니다.");
  }
  return profile.profileCompleted;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribeSession,
    getSessionSnapshot,
    getServerSessionSnapshot,
  );
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const preview = pathname === "/preview" || pathname.startsWith("/preview/");
  const authenticated = snapshot.status === "authenticated";
  const profile = useMe<boolean>({
    query: { enabled: authenticated && !preview, select: selectProfileCompleted },
  });
  const profileCompleted = authenticated ? (profile.data ?? null) : null;
  // 다른 사용자의 프로필 404와 구분하기 위해 내 프로필 조회 결과만 판단한다.
  const accountNotFound =
    !preview &&
    authenticated &&
    profile.isError &&
    profile.error instanceof TmtApiError &&
    profile.error.httpStatus === 404 &&
    getTmtApiErrorCode(profile.error) === "USER_NOT_FOUND";
  const requiresSignup =
    !preview &&
    !accountNotFound &&
    profileCompleted === false &&
    pathname !== ROUTES.SIGNUP &&
    pathname !== "/auth/complete";

  useEffect(() => {
    if (requiresSignup) router.replace(ROUTES.SIGNUP);
  }, [requiresSignup, router]);

  useEffect(() => {
    let revision = getSessionSnapshot().revision;
    const unsubscribe = subscribeSession(() => {
      const nextRevision = getSessionSnapshot().revision;
      if (nextRevision !== revision) {
        revision = nextRevision;
        queryClient.clear();
      }
    });
    const disconnect = connectSessionChannel();
    return () => {
      unsubscribe();
      disconnect();
    };
  }, [queryClient]);

  useEffect(() => {
    if (!preview && getSessionSnapshot().status === "loading") {
      void refreshSession().catch(() => undefined);
    }
  }, [preview]);

  useEffect(() => {
    if (snapshot.status === "anonymous" && !isPublicPage(pathname)) {
      const returnTo = safeReturnTo(`${window.location.pathname}${window.location.search}`);
      router.replace(`${ROUTES.LOGIN}?returnTo=${encodeURIComponent(returnTo)}`);
    }
  }, [pathname, router, snapshot.status]);

  const waitingForPublicProfile = pathname.startsWith("/profile/") && snapshot.status === "loading";
  const mustWait =
    (!isPublicPage(pathname) && !authenticated) ||
    waitingForPublicProfile ||
    (!preview && authenticated && profileCompleted === null) ||
    requiresSignup;
  const logoutFailed = snapshot.status === "logout-error";
  const sessionFailed = snapshot.status === "error";
  // 가입 상태가 확인된 뒤의 재조회 실패로 작성 중인 화면을 언마운트하지 않는다.
  const profileFailed = !preview && authenticated && profileCompleted === null && profile.isError;
  const failed =
    logoutFailed || profileFailed || ((mustWait || pathname === "/auth/complete") && sessionFailed);

  function returnToLogin() {
    void logoutSession()
      .then(() => router.replace(ROUTES.LOGIN))
      .catch(() => undefined);
  }

  const content = accountNotFound ? (
    <ErrorFallback
      title="로그인 정보를 확인할 수 없어요."
      description="재 로그인해 주세요."
      actionLabel="재 로그인"
      onRetry={returnToLogin}
    />
  ) : failed ? (
    <ErrorFallback
      title={
        logoutFailed
          ? "로그아웃하지 못했어요. 다시 시도해 주세요."
          : "로그인 상태를 확인하지 못했어요."
      }
      onRetry={() => {
        if (logoutFailed) returnToLogin();
        else if (profileFailed) void profile.refetch();
        else void refreshSession().catch(() => undefined);
      }}
    />
  ) : mustWait || snapshot.status === "logging-out" ? (
    <main
      role="status"
      className="flex flex-1 items-center justify-center gap-ds-8 text-content-secondary"
    >
      <Spinner />
      <span className="text-body-md-medium">
        {snapshot.status === "logging-out" ? "로그아웃 중이에요" : "로그인 상태를 확인하고 있어요"}
      </span>
    </main>
  ) : (
    children
  );

  return (
    <AuthContext value={{ ...snapshot, profileCompleted, logout: logoutSession, announceLogin }}>
      {content}
    </AuthContext>
  );
}
