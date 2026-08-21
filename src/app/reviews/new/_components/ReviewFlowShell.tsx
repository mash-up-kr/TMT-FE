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
  REVIEW_STEP_COUNT,
  REVIEW_STEPS,
} from "../_constants/steps";
import { ReviewDraftProvider } from "../_stores/ReviewDraftProvider";
import { ExitConfirmModal } from "./ExitConfirmModal";

/** 현재 경로가 몇 번째 단계인지. 완료 화면처럼 단계가 아닌 경로면 null. */
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
  // 1단계에는 돌아갈 앞 단계가 없다. 시안도 2단계부터 뒤로가기를 그린다.
  const canGoBack = completedSteps !== null && completedSteps > 0;
  // 완료 화면은 단계가 아니다. 제목이 "완료"로 바뀌고 작성이 이미 끝나 이탈 확인이 성립하지 않는다.
  const isComplete = pathname === REVIEW_COMPLETE_PATH;

  const handleClose = () => {
    if (isComplete) {
      router.back();
      return;
    }

    setExitOpen(true);
  };

  return (
    <ReviewDraftProvider>
      <GNB
        title={isComplete ? "완료" : "리뷰 쓰기"}
        left={
          canGoBack ? (
            <IconButton aria-label="이전 단계로" onClick={() => router.back()}>
              <ChevronLeftIcon />
            </IconButton>
          ) : undefined
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
