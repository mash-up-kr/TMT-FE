"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGetSave } from "@/api/gen/save/save.gen";
import { ROUTES } from "@/shared/constants/routes";
import { UT2_STEPS } from "@/shared/constants/ut2";
import { useUt2Step } from "@/shared/hooks/useUt2Step";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { MapPinIcon } from "@/shared/ui/Icons";
import { REVIEW_FLOW_EXIT_PATH, reviewStepPath } from "../../_constants/steps";
import { useReviewDraftGuard } from "../../_hooks/useReviewDraftGuard";
import { useReviewDraft } from "../../_stores/ReviewDraftProvider";
import { useReviewFlowBase, useReviewFlowSaveId } from "../../_stores/ReviewFlowBaseProvider";
import { ReviewCompleteVisual } from "../ReviewCompleteVisual";

export function CompleteScreen() {
  const router = useRouter();
  const basePath = useReviewFlowBase();
  const saveId = useReviewFlowSaveId();
  const store = useReviewDraftGuard();
  const { saveResult } = useReviewDraft();
  const grantedTicketCount = saveResult?.grantedTicketCount ?? 0;
  const save = useGetSave(saveId ?? "", {
    query: { enabled: saveId !== null },
  });
  const isComplete = save.data?.reviewId !== null && save.data?.reviewId !== undefined;

  useEffect(() => {
    if (store !== null && (saveId === null || (save.isSuccess && !isComplete))) {
      router.replace(reviewStepPath(basePath, "rating"));
    }
  }, [basePath, isComplete, router, save.isSuccess, saveId, store]);

  // ⚠️ UT2 임시 계측. Task 1의 건너뛰기 제출에서도 이 화면을 거쳐 한 번 더 찍힌다.
  useUt2Step(UT2_STEPS.REVIEW_COMPLETE, isComplete);

  if (store === null || !isComplete) {
    return null;
  }

  return (
    <>
      <div className="content-container flex flex-1 flex-col items-center gap-ds-16 py-ds-48">
        <header className="flex flex-col items-center gap-ds-12">
          <h1 className="text-center text-heading-lg text-content-primary">
            리뷰 작성이
            <br />
            완료되었어요!
          </h1>
          <p className="flex items-center gap-ds-4 text-body-lg-medium text-content-interactive-primary">
            <MapPinIcon size={20} />
            {store.name}
          </p>
          {grantedTicketCount > 0 ? (
            <p className="text-center text-body-md-medium text-content-secondary">
              그룹 가입 티켓 {grantedTicketCount}장을 받았어요
            </p>
          ) : null}
        </header>

        <ReviewCompleteVisual />
      </div>

      <div className="content-container pt-ds-12 pb-ds-32">
        <ButtonStack type="horizontal">
          <Button variant="tertiary" onClick={() => router.replace(REVIEW_FLOW_EXIT_PATH)}>
            홈으로 가기
          </Button>
          <Button onClick={() => router.replace(ROUTES.FEED)}>다른 리뷰 보러가기</Button>
        </ButtonStack>
      </div>
    </>
  );
}
