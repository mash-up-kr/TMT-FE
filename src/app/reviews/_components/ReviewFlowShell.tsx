"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { syncJoinGroupIntent } from "@/shared/constants/reviewJoinGroup";
import { UT2_STEPS } from "@/shared/constants/ut2";
import { useUt2Step } from "@/shared/hooks/useUt2Step";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon, ChevronLeftIcon } from "@/shared/ui/Icons";
import { Progress } from "@/shared/ui/Progress";
import { getReviewReturnTo } from "@/shared/utils/reviewNavigation";
import {
  DRAFT_REVIEW_FIRST_STEP,
  NEW_REVIEW_BASE_PATH,
  REVIEW_STEP_COUNT,
  REVIEW_STEPS,
  reviewCompletePath,
  reviewStepPath,
} from "../_constants/steps";
import { useReviewSave } from "../_hooks/useReviewSave";
import type { ReviewDraftSnapshot } from "../_model/draft";
import { ReviewDraftProvider } from "../_stores/ReviewDraftProvider";
import {
  ReviewFlowBaseProvider,
  useReviewFlowReturnTo,
  useReviewFlowSaveId,
} from "../_stores/ReviewFlowBaseProvider";
import { ExitConfirmModal, type ExitConfirmVariant } from "./ExitConfirmModal";

// 이탈 확인 모달은 셸이 하나만 들고 있다. X 버튼과 "나중에 추가할게요"가 같은 흐름이라
// 확인 UI가 하나여야 동작이 갈리지 않는다. 단계는 여는 것만 요청한다.
const ReviewFlowExitContext = createContext<(() => void) | null>(null);

export function useReviewFlowExit() {
  const value = useContext(ReviewFlowExitContext);

  if (value === null) {
    throw new Error("useReviewFlowExit는 ReviewFlowShell 안에서만 쓸 수 있다.");
  }

  return value;
}

function findStepIndex(basePath: string, pathname: string) {
  // 매장 검색은 초안이 없어 경로가 곧 첫 단계다. 뒤에 붙일 단계 세그먼트가 없다.
  if (pathname === NEW_REVIEW_BASE_PATH) {
    return 0;
  }

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
  const searchParams = useSearchParams();
  const returnTo = getReviewReturnTo(searchParams);

  // 새로 쓰기로 들어온 순간에만 판단한다. 이어쓰기는 초안에 이미 묶인 값을 그대로 쓴다.
  useEffect(() => {
    if (basePath === NEW_REVIEW_BASE_PATH) {
      syncJoinGroupIntent(window.location.search);
    }
  }, [basePath]);

  return (
    <ReviewFlowBaseProvider basePath={basePath} saveId={saveId} returnTo={returnTo}>
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
  const returnTo = useReviewFlowReturnTo();
  const saveId = useReviewFlowSaveId();
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
  // 진입 직전 화면으로 replace해야 리뷰 플로우의 단계 URL이 히스토리에 남지 않는다.
  const exitFlow = () => router.replace(returnTo);

  // 초안은 다음 단계로 넘어갈 때 처음 만들어진다. 그래서 첫 단계에서 나가면 입력이 사라지고,
  // 그 뒤로는 초안으로 저장된다. 나가기가 남기는 결과가 다르니 확인 문구도 갈라야 한다.
  const exitVariant: ExitConfirmVariant = saveId === null ? "discard" : "keep";
  const requestExit = () => setExitOpen(true);

  return (
    <ReviewFlowExitContext.Provider value={requestExit}>
      {!isComplete && (
        <GNB
          title="리뷰 쓰기"
          left={
            canGoBack && (
              <IconButton aria-label="이전 단계로" onClick={() => router.back()}>
                <ChevronLeftIcon />
              </IconButton>
            )
          }
          right={
            <IconButton aria-label="리뷰 작성 닫기" onClick={requestExit}>
              <CancelIcon thick />
            </IconButton>
          }
        />
      )}

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
        variant={exitVariant}
        onExit={exitVariant === "discard" ? exitFlow : reviewSave.saveAndExit}
        isPending={reviewSave.isPending}
      />
    </ReviewFlowExitContext.Provider>
  );
}
