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
import { ROUTES } from "@/shared/constants/routes";
import { AuthContext } from "@/shared/providers/AuthContext";
import { Button } from "@/shared/ui/Button";
import { LoadingIcon } from "@/shared/ui/Icons";
import { isPublicPage, safeReturnTo } from "@/shared/utils/authNavigation";

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
    (!isPublicPage(pathname) && snapshot.status !== "authenticated") || waitingForPublicProfile;
  const logoutFailed = snapshot.status === "logout-error";
  const sessionFailed = snapshot.status === "error";
  const failed = logoutFailed || ((mustWait || pathname === "/auth/complete") && sessionFailed);
  const content = failed ? (
    <main className="content-container flex flex-1 flex-col items-center justify-center gap-ds-20 text-center">
      <p role="alert" className="text-body-md-medium text-content-secondary">
        {logoutFailed
          ? "로그아웃하지 못했어요. 다시 시도해 주세요."
          : "로그인 상태를 확인하지 못했어요."}
      </p>
      <Button
        onClick={() =>
          void (logoutFailed ? logoutSession() : refreshSession()).catch(() => undefined)
        }
      >
        다시 시도
      </Button>
    </main>
  ) : mustWait || snapshot.status === "logging-out" ? (
    <main
      role="status"
      className="flex flex-1 items-center justify-center gap-ds-8 text-content-secondary"
    >
      <LoadingIcon className="animate-spin" />
      <span className="text-body-md-medium">
        {snapshot.status === "logging-out" ? "로그아웃 중이에요" : "로그인 상태를 확인하고 있어요"}
      </span>
    </main>
  ) : (
    children
  );

  return (
    <AuthContext value={{ ...snapshot, logout: logoutSession, announceLogin }}>
      {content}
    </AuthContext>
  );
}
