"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon } from "@/shared/ui/icons";
import { Progress } from "@/shared/ui/Progress";
import { REVIEW_FLOW_BASE_PATH, REVIEW_STEP_COUNT, REVIEW_STEPS } from "../_constants/steps";
import { ReviewDraftProvider } from "../_stores/ReviewDraftProvider";
import { ExitConfirmModal } from "./ExitConfirmModal";

/**
 * 프로그레스는 "현재 단계"가 아니라 "완료한 단계 수"다. 1단계 진입 시 0이고,
 * 시안의 인디케이터 폭(1단계 0% · 2단계 25% · 4단계 75%)이 이 규칙의 근거다.
 */
function completedStepCount(pathname: string) {
  return REVIEW_STEPS.findIndex((step) => pathname === `${REVIEW_FLOW_BASE_PATH}/${step.segment}`);
}

export function ReviewFlowShell({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const [exitOpen, setExitOpen] = useState(false);

  const completed = completedStepCount(pathname);

  return (
    <ReviewDraftProvider>
      <GNB
        title="리뷰 쓰기"
        right={
          <IconButton aria-label="리뷰 작성 닫기" onClick={() => setExitOpen(true)}>
            <CancelIcon thick />
          </IconButton>
        }
      />

      <main className="flex min-h-0 flex-1 flex-col">
        {completed >= 0 && (
          <div className="content-container pt-ds-20">
            <Progress
              value={completed}
              max={REVIEW_STEP_COUNT}
              aria-label={`리뷰 작성 ${REVIEW_STEP_COUNT}단계 중 ${completed}단계 완료`}
            />
          </div>
        )}
        {children}
      </main>

      <ExitConfirmModal
        open={exitOpen}
        onOpenChange={setExitOpen}
        onExit={() => {
          setExitOpen(false);
          router.back();
        }}
      />
    </ReviewDraftProvider>
  );
}
