"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon, ChevronLeftIcon } from "@/shared/ui/Icons";
import { Progress } from "@/shared/ui/Progress";
import {
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

/**
 * 단계 플로우의 공통 껍데기.
 *
 * 기준 경로를 prop으로만 받고 트리 종류를 나타내는 플래그는 받지 않는다. 셸이 "새 리뷰냐
 * 이어쓰기냐"를 알기 시작하면 트리를 나눈 이유가 사라진다.
 */
export function ReviewFlowShell({
  basePath,
  initialDraft,
  children,
}: Readonly<{ basePath: string; initialDraft?: ReviewDraftSnapshot; children: ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const [exitOpen, setExitOpen] = useState(false);

  // 프로그레스는 "현재 단계"가 아니라 "완료한 단계 수"다. 앞선 단계가 곧 완료한 단계이므로
  // 단계 인덱스가 그대로 완료 수가 된다. 시안 인디케이터 폭(1단계 0% · 2단계 25% · 4단계 75%)이 근거다.
  const completedSteps = findStepIndex(basePath, pathname);
  const canGoBack = completedSteps !== null && completedSteps > 0;
  const isComplete = pathname === reviewCompletePath(basePath);

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
