import type { Metadata } from "next";
import { Suspense } from "react";
import { OnboardingScreen } from "./_components/OnboardingScreen";

export const metadata: Metadata = {
  title: "시작하기",
};

export default function OnboardingPage() {
  // 화면이 복귀 경로를 useSearchParams로 읽어 프리렌더가 불가하다. 경계를 여기서 준다.
  return (
    <Suspense>
      <OnboardingScreen />
    </Suspense>
  );
}
