import type { Metadata } from "next";
import { OnboardingScreen } from "./_components/OnboardingScreen";

export const metadata: Metadata = {
  title: "시작하기",
};

export default function OnboardingPage() {
  return <OnboardingScreen />;
}
