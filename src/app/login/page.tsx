"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { safeReturnTo } from "@/shared/utils/authNavigation";
import { LoginScreen } from "./_components/LoginScreen";
import { useKakaoLogin } from "./_hooks/useKakaoLogin";

function Login() {
  const { status } = useAuth();
  const params = useSearchParams();
  const router = useRouter();
  const returnTo = safeReturnTo(params.get("returnTo"));
  const { pending, error, login } = useKakaoLogin(returnTo, params.get("error"));

  useEffect(() => {
    if (status === "authenticated") router.replace(returnTo);
  }, [status, returnTo, router]);

  return (
    <LoginScreen
      loading={pending}
      disabled={status === "loading" || status === "authenticated"}
      error={error}
      onLogin={() => void login()}
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginScreen disabled onLogin={() => undefined} />}>
      <Login />
    </Suspense>
  );
}
