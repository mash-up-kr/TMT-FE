"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "@/shared/constants/routes";
import { useAuth } from "@/shared/hooks/useAuth";
import { useSignup } from "../_hooks/useSignup";
import { SignupForm } from "./SignupForm";

export function SignupScreen() {
  const { state } = useAuth();
  const router = useRouter();
  const signup = useSignup();
  useEffect(() => {
    if (state.status === "authenticated") router.replace(ROUTES.ONBOARDING);
  }, [state.status, router]);

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
