import type { Metadata } from "next";
import { Suspense } from "react";
import { SignupScreen } from "./_components/SignupScreen";

export const metadata: Metadata = {
  title: "회원가입",
};

export default function SignupPage() {
  // 화면이 복귀 경로를 useSearchParams로 읽어 프리렌더가 불가하다. 경계를 여기서 준다.
  return (
    <Suspense>
      <SignupScreen />
    </Suspense>
  );
}
