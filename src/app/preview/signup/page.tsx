"use client";

import { SignupForm } from "@/app/signup/_components/SignupForm";

/** 입력·확인 모달의 시각 검증용. 실제 프로필 저장은 실행하지 않는다. */
export default function SignupPreviewPage() {
  return <SignupForm isPending={false} onConfirm={() => {}} onResetError={() => {}} />;
}
