"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { MapPinIcon } from "@/shared/ui/Icons";
import { ReviewCompleteVisual } from "../_components/ReviewCompleteVisual";
import { REVIEW_FLOW_EXIT_PATH } from "../_constants/steps";
import { useReviewDraftGuard } from "../_hooks/useReviewDraftGuard";
import { useReviewDraft } from "../_stores/ReviewDraftProvider";

export default function ReviewCompletePage() {
  const router = useRouter();
  const { photos } = useReviewDraft();
  const store = useReviewDraftGuard();

  if (store === null) {
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
        </header>

        <ReviewCompleteVisual photos={photos} />
      </div>

      <div className="content-container pt-ds-12 pb-ds-32">
        <ButtonStack type="horizontal">
          <Button variant="tertiary" onClick={() => router.replace(REVIEW_FLOW_EXIT_PATH)}>
            홈으로 가기
          </Button>
          {/* 피드 라우트는 아직 없다. 시안 주석 기준 이동 대상만 먼저 연결해 둔다. */}
          <Button onClick={() => router.replace("/feed")}>다른 리뷰 보러가기</Button>
        </ButtonStack>
      </div>
    </>
  );
}
