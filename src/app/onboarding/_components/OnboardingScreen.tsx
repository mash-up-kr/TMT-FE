"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared/constants/routes";
import { toast } from "@/shared/ui/Toast";
import { OnboardingView } from "./OnboardingView";

const SKIP_TOAST_MESSAGE = "프로필 생성을 완료했어요";

/** 뒤로 돌아올 화면이 아니라 이동은 모두 `replace`다. */
export function OnboardingScreen() {
  const router = useRouter();

  return (
    <OnboardingView
      onSkip={() => {
        toast.success(SKIP_TOAST_MESSAGE);
        router.replace(ROUTES.ROOT);
      }}
      onStart={() => router.replace(ROUTES.REVIEWS.NEW)}
    />
  );
}
