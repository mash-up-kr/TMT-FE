"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { ROUTES } from "@/shared/constants/routes";
import { useAuth } from "@/shared/hooks/useAuth";
import { PageLoading } from "@/shared/ui/PageLoading";
import { toast } from "@/shared/ui/Toast";
import { safeReturnTo } from "@/shared/utils/authNavigation";

function CompleteLogin() {
  const { state, announceLogin } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const completed = useRef(false);
  useEffect(() => {
    if (state.status === "anonymous") router.replace(`${ROUTES.LOGIN}?error=unavailable`);
    if (completed.current) return;
    if (state.status !== "authenticated" && state.status !== "signup-required") return;
    completed.current = true;
    announceLogin();
    if (state.status === "signup-required") {
      router.replace(ROUTES.SIGNUP);
      return;
    }
    const isNewUser = params.get("new") === "1";
    if (!isNewUser) toast.success("로그인했어요");
    // 가입 직후에만 온보딩을 거친다. 이후 로그인은 원래 가려던 곳으로 돌아간다.
    router.replace(isNewUser ? ROUTES.ONBOARDING : safeReturnTo(params.get("returnTo")));
  }, [state.status, announceLogin, router, params]);
  return <PageLoading />;
}

export default function CompleteLoginPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <CompleteLogin />
    </Suspense>
  );
}
