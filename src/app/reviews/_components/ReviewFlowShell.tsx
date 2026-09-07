"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { syncJoinGroupIntent } from "@/shared/constants/reviewJoinGroup";
import { UT2_STEPS } from "@/shared/constants/ut2";
import { useUt2Step } from "@/shared/hooks/useUt2Step";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon, ChevronLeftIcon } from "@/shared/ui/Icons";
import { Progress } from "@/shared/ui/Progress";
import {
  DRAFT_REVIEW_FIRST_STEP,
  NEW_REVIEW_BASE_PATH,
  REVIEW_FLOW_EXIT_PATH,
  REVIEW_STEP_COUNT,
  REVIEW_STEPS,
  reviewCompletePath,
  reviewStepPath,
} from "../_constants/steps";
import { useReviewSave } from "../_hooks/useReviewSave";
import type { ReviewDraftSnapshot } from "../_model/draft";
import { ReviewDraftProvider, useReviewDraft } from "../_stores/ReviewDraftProvider";
import { ReviewFlowBaseProvider, useReviewFlowSaveId } from "../_stores/ReviewFlowBaseProvider";
import { ExitConfirmModal } from "./ExitConfirmModal";

// 이탈 확인 모달은 셸이 하나만 들고 있다. 사진 제외 문구 분기가 셸의 초안 상태에 붙어 있어,
// 단계마다 모달을 따로 띄우면 그 판단이 흩어진다. 단계는 여는 것만 요청한다.
const ReviewFlowExitContext = createContext<(() => void) | null>(null);

export function useReviewFlowExit() {
  const value = useContext(ReviewFlowExitContext);

  if (value === null) {
    throw new Error("useReviewFlowExit는 ReviewFlowShell 안에서만 쓸 수 있다.");
  }

  return value;
}

function findStepIndex(basePath: string, pathname: string) {
  const index = REVIEW_STEPS.findIndex((segment) => pathname === reviewStepPath(basePath, segment));

  return index === -1 ? null : index;
}

export function ReviewFlowShell({
  basePath,
  saveId = null,
  initialDraft,
  children,
}: Readonly<{
  basePath: string;
  saveId?: string | null;
  initialDraft?: ReviewDraftSnapshot;
  children: ReactNode;
}>) {
  // 새로 쓰기로 들어온 순간에만 판단한다. 이어쓰기는 초안에 이미 묶인 값을 그대로 쓴다.
  useEffect(() => {
    if (basePath === NEW_REVIEW_BASE_PATH) {
      syncJoinGroupIntent(window.location.search);
    }
  }, [basePath]);

  return (
    <ReviewFlowBaseProvider basePath={basePath} saveId={saveId}>
      <ReviewDraftProvider initialDraft={initialDraft}>
        <ReviewFlowContent basePath={basePath}>{children}</ReviewFlowContent>
      </ReviewDraftProvider>
    </ReviewFlowBaseProvider>
  );
}

function ReviewFlowContent({
  basePath,
  children,
}: Readonly<{ basePath: string; children: ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const [exitOpen, setExitOpen] = useState(false);
  const saveId = useReviewFlowSaveId();
  const { photos, attachedPhotoCount } = useReviewDraft();
  const reviewSave = useReviewSave();

  const completedSteps = findStepIndex(basePath, pathname);
  const firstStepIndex =
    basePath === NEW_REVIEW_BASE_PATH ? 0 : REVIEW_STEPS.indexOf(DRAFT_REVIEW_FIRST_STEP);
  const canGoBack = completedSteps !== null && completedSteps > firstStepIndex;
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

  // 첫 단계에서는 아직 초안이 없다(초안은 다음 단계로 넘어갈 때 처음 만들어진다).
  // 저장할 것이 없는데 "저장하고 나가기"를 묻는 셈이라 확인 없이 바로 나간다.
  const requestExit = () => {
    if (saveId === null) {
      exitFlow();
      return;
    }

    setExitOpen(true);
  };

  const handleClose = () => {
    if (isComplete) {
      exitFlow();
      return;
    }

    requestExit();
  };

  return (
    <ReviewFlowExitContext.Provider value={requestExit}>
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
          <div className="content-container shrink-0 pt-ds-20">
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
        onExit={reviewSave.saveAndExit}
        isPending={reviewSave.isPending}
        excludesPhotos={photos.length > 0 && attachedPhotoCount === 0}
      />
    </ReviewFlowExitContext.Provider>
  );
}
