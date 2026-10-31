"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { getBrowseTarget, safeReturnTo } from "@/shared/utils/authNavigation";
import { LoginScreen } from "./_components/LoginScreen";
import { useKakaoLogin } from "./_hooks/useKakaoLogin";

function Login() {
  const { state } = useAuth();
  const params = useSearchParams();
  const router = useRouter();
  const returnTo = safeReturnTo(params.get("returnTo"));
  const { pending, error, login } = useKakaoLogin(returnTo, params.get("error"));

  useEffect(() => {
    // 가입 미완료는 AuthProvider가 복귀 경로와 함께 가입 화면으로 보낸다.
    if (state.status === "authenticated") router.replace(returnTo);
  }, [state.status, returnTo, router]);

  return (
    <LoginScreen
      loading={pending}
      disabled={state.status !== "anonymous" && state.status !== "error"}
      error={error}
      onLogin={() => void login()}
      onBrowse={() => router.replace(getBrowseTarget(returnTo))}
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={<LoginScreen disabled onLogin={() => undefined} onBrowse={() => undefined} />}
    >
      <Login />
    </Suspense>
  );
}
