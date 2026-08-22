"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon, ChevronLeftIcon } from "@/shared/ui/Icons";
import { Progress } from "@/shared/ui/Progress";
import {
  REVIEW_COMPLETE_PATH,
  REVIEW_FLOW_BASE_PATH,
  REVIEW_FLOW_EXIT_PATH,
  REVIEW_STEP_COUNT,
  REVIEW_STEPS,
} from "../_constants/steps";
import { ReviewDraftProvider } from "../_stores/ReviewDraftProvider";
import { ExitConfirmModal } from "./ExitConfirmModal";

function findStepIndex(pathname: string) {
  const index = REVIEW_STEPS.findIndex(
    (step) => pathname === `${REVIEW_FLOW_BASE_PATH}/${step.segment}`,
  );

  return index === -1 ? null : index;
}

export function ReviewFlowShell({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const [exitOpen, setExitOpen] = useState(false);

  // 프로그레스는 "현재 단계"가 아니라 "완료한 단계 수"다. 앞선 단계가 곧 완료한 단계이므로
  // 단계 인덱스가 그대로 완료 수가 된다. 시안 인디케이터 폭(1단계 0% · 2단계 25% · 4단계 75%)이 근거다.
  const completedSteps = findStepIndex(pathname);
  const canGoBack = completedSteps !== null && completedSteps > 0;
  const isComplete = pathname === REVIEW_COMPLETE_PATH;

  // 플로우 밖으로 나간다. 단계마다 히스토리가 쌓여 있어 back()으로는 앞 단계로 갈 뿐이다.
  // 여기서 layout이 언마운트되며 초안과 사진 미리보기 URL이 함께 정리된다.
  const exitFlow = () => router.replace(REVIEW_FLOW_EXIT_PATH);

  const handleClose = () => {
    if (isComplete) {
      exitFlow();
      return;
    }

    setExitOpen(true);
  };

  return (
    <ReviewDraftProvider>
      <GNB
        title={isComplete ? "완료" : "리뷰 쓰기"}
        left={
          canGoBack && (
            <IconButton aria-label="이전 단계로" onClick={() => router.back()}>
              <ChevronLeftIcon />
            </IconButton>
          )
        }
        right={
          <IconButton aria-label={isComplete ? "닫기" : "리뷰 작성 닫기"} onClick={handleClose}>
            <CancelIcon thick />
          </IconButton>
        }
      />

      <main className="flex min-h-0 flex-1 flex-col">
        {completedSteps !== null && (
          <div className="content-container pt-ds-20">
            <Progress
              value={completedSteps}
              max={REVIEW_STEP_COUNT}
              aria-label={`리뷰 작성 ${REVIEW_STEP_COUNT}단계 중 ${completedSteps}단계 완료`}
            />
          </div>
        )}
        {children}
      </main>

      <ExitConfirmModal open={exitOpen} onOpenChange={setExitOpen} onExit={exitFlow} />
    </ReviewDraftProvider>
  );
}
