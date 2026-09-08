"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { ROUTES } from "@/shared/constants/routes";
import { useAuth } from "@/shared/hooks/useAuth";
import { toast } from "@/shared/ui/Toast";
import { safeReturnTo } from "@/shared/utils/authNavigation";

function CompleteLogin() {
  const { status, announceLogin } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const completed = useRef(false);
  useEffect(() => {
    if (status === "anonymous") router.replace(`${ROUTES.LOGIN}?error=unavailable`);
    if (status !== "authenticated" || completed.current) return;
    completed.current = true;
    announceLogin();
    const isNewUser = params.get("new") === "1";
    if (!isNewUser) toast.success("로그인했어요");
    // 가입 직후에만 온보딩을 거친다. 이후 로그인은 원래 가려던 곳으로 돌아간다.
    router.replace(isNewUser ? ROUTES.ONBOARDING : safeReturnTo(params.get("returnTo")));
  }, [status, announceLogin, router, params]);
  return (
    <p role="status" className="m-auto text-body-md-medium text-content-secondary">
      로그인을 완료하고 있어요
    </p>
  );
}

export default function CompleteLoginPage() {
  return (
    <Suspense>
      <CompleteLogin />
    </Suspense>
  );
}
