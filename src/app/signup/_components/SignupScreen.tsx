"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "@/shared/constants/routes";
import { useAuth } from "@/shared/hooks/useAuth";
import { useSignup } from "../_hooks/useSignup";
import { SignupForm } from "./SignupForm";

export function SignupScreen() {
  const { profileCompleted } = useAuth();
  const router = useRouter();
  const signup = useSignup();
  useEffect(() => {
    if (profileCompleted === true) router.replace(ROUTES.ONBOARDING);
  }, [profileCompleted, router]);

  if (profileCompleted !== false) return null;
  return (
    <SignupForm
      isPending={signup.isPending}
      error={signup.error}
      onConfirm={signup.submit}
      onResetError={signup.reset}
    />
  );
}
