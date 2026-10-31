"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "@/shared/constants/routes";
import { useAuth } from "@/shared/hooks/useAuth";
import { pathWithReturnTo, safeReturnTo } from "@/shared/utils/authNavigation";
import { useSignup } from "../_hooks/useSignup";
import { SignupForm } from "./SignupForm";

export function SignupScreen() {
  const { state } = useAuth();
  const router = useRouter();
  const returnTo = safeReturnTo(useSearchParams().get("returnTo"));
  const signup = useSignup();
  useEffect(() => {
    if (state.status === "authenticated") {
      router.replace(pathWithReturnTo(ROUTES.ONBOARDING, returnTo));
    }
  }, [state.status, router, returnTo]);

  if (state.status !== "signup-required") return null;
  return (
    <SignupForm
      isPending={signup.isPending}
      error={signup.error}
      onConfirm={signup.submit}
      onResetError={signup.reset}
    />
  );
}
