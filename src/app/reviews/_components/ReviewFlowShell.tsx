"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { UT2_STEPS } from "@/shared/constants/ut2";
import { useUt2Step } from "@/shared/hooks/useUt2Step";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon, ChevronLeftIcon } from "@/shared/ui/Icons";
import { Progress } from "@/shared/ui/Progress";
import {
  NEW_REVIEW_BASE_PATH,
  REVIEW_FLOW_EXIT_PATH,
  REVIEW_STEP_COUNT,
  REVIEW_STEPS,
  reviewCompletePath,
  reviewStepPath,
} from "../_constants/steps";
import type { ReviewDraftSnapshot } from "../_model/draft";
import { ReviewDraftProvider } from "../_stores/ReviewDraftProvider";
import { ReviewFlowBaseProvider } from "../_stores/ReviewFlowBaseProvider";
import { ExitConfirmModal } from "./ExitConfirmModal";

function findStepIndex(basePath: string, pathname: string) {
  const index = REVIEW_STEPS.findIndex((segment) => pathname === reviewStepPath(basePath, segment));

  return index === -1 ? null : index;
}

export function ReviewFlowShell({
  basePath,
  initialDraft,
  children,
}: Readonly<{ basePath: string; initialDraft?: ReviewDraftSnapshot; children: ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const [exitOpen, setExitOpen] = useState(false);

  const completedSteps = findStepIndex(basePath, pathname);
  const canGoBack = completedSteps !== null && completedSteps > 0;
  const isComplete = pathname === reviewCompletePath(basePath);

  // ⚠️ UT2 임시 계측. 새로 쓰기는 1-1, 이어쓰기는 2-5로 갈린다.
  useUt2Step(
    basePath === NEW_REVIEW_BASE_PATH
      ? UT2_STEPS.REVIEW_WRITE_SKIP
      : UT2_STEPS.REVIEW_CONTINUE_WRITING,
  );

  // back()은 단계마다 쌓인 히스토리를 한 칸 되돌릴 뿐이라 플로우 밖으로 나가지 못한다.
  // 홈으로 replace해야 layout이 내려가면서 초안과 미리보기 URL도 함께 정리된다.
  const exitFlow = () => router.replace(REVIEW_FLOW_EXIT_PATH);

  const handleClose = () => {
    if (isComplete) {
      exitFlow();
      return;
    }

    setExitOpen(true);
  };

  return (
    <ReviewFlowBaseProvider basePath={basePath}>
      <ReviewDraftProvider initialDraft={initialDraft}>
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
    </ReviewFlowBaseProvider>
  );
}
