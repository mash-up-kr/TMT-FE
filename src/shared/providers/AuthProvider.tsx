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
import { ErrorFallback } from "@/shared/components/ErrorFallback";
import { ROUTES } from "@/shared/constants/routes";
import { AuthContext } from "@/shared/providers/AuthContext";
import { PageLoading } from "@/shared/ui/PageLoading";
import { Spinner } from "@/shared/ui/Spinner";
import { isPublicPage, safeReturnTo } from "@/shared/utils/authNavigation";
import { getAuthState } from "./authState";

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
  const hasSession = snapshot.status === "authenticated";
  const profile = useMe<boolean>({
    query: { enabled: hasSession && !preview, select: selectProfileCompleted },
  });
  const state = getAuthState(snapshot.status, profile);
  const requiresSignup =
    !preview &&
    state.status === "signup-required" &&
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

  function returnToLogin() {
    void logoutSession()
      .then(() => router.replace(ROUTES.LOGIN))
      .catch(() => undefined);
  }

  function renderContent(): ReactNode {
    // 미리보기는 인증 가드를 거치지 않지만, 진행 중인 로그아웃은 끝까지 처리한다.
    if (preview && state.status !== "logging-out") {
      if (state.status !== "error" || state.source !== "logout") return children;
    }

    switch (state.status) {
      case "authenticated":
        return children;
      case "anonymous":
        return isPublicPage(pathname) ? children : <PageLoading />;
      case "restoring-session":
        // 공개 프로필도 내 계정인지 구분할 수 있도록 세션 복원을 기다린다.
        if (isPublicPage(pathname) && !pathname.startsWith("/profile/")) return children;
        return <PageLoading />;
      case "checking-profile":
        return <PageLoading />;
      case "signup-required":
        return requiresSignup ? <PageLoading /> : children;
      case "account-not-found":
        return (
          <ErrorFallback
            title="로그인 정보를 확인할 수 없어요."
            description="재 로그인해 주세요."
            actionLabel="재 로그인"
            onRetry={returnToLogin}
          />
        );
      case "logging-out":
        return <LogoutPending />;
      case "error":
        switch (state.source) {
          case "logout":
            return (
              <ErrorFallback
                title="로그아웃하지 못했어요. 다시 시도해 주세요."
                onRetry={returnToLogin}
              />
            );
          case "profile":
            return (
              <ErrorFallback
                title="로그인 상태를 확인하지 못했어요."
                onRetry={() => void profile.refetch()}
                secondaryAction={{ label: "재 로그인", onClick: returnToLogin }}
              />
            );
          case "session":
            if (isPublicPage(pathname) && pathname !== "/auth/complete") return children;
            return (
              <ErrorFallback
                title="로그인 상태를 확인하지 못했어요."
                onRetry={() => void refreshSession().catch(() => undefined)}
              />
            );
        }
    }
  }

  return (
    <AuthContext value={{ state, logout: logoutSession, announceLogin }}>
      {renderContent()}
    </AuthContext>
  );
}

function LogoutPending() {
  return (
    <main
      role="status"
      className="flex flex-1 items-center justify-center gap-ds-8 text-content-secondary"
    >
      <Spinner />
      <span className="text-body-md-medium">로그아웃 중이에요</span>
    </main>
  );
}
