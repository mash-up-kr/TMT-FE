"use client";

import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { Textarea } from "@/shared/ui/TextField";
import { MAX_REVIEW_TEXT_LENGTH } from "../../_constants/review";
import { useReviewDraftGuard } from "../../_hooks/useReviewDraftGuard";
import { useReviewSave } from "../../_hooks/useReviewSave";
import { useReviewDraft } from "../../_stores/ReviewDraftProvider";
import { useReviewFlowExit } from "../ReviewFlowShell";
import { ReviewStepLayout } from "../ReviewStepLayout";
import { StarRatingField } from "../StarRatingField";
import { StepHeader } from "../StepHeader";

export function RatingStep() {
  const { rating, setRating, reviewText, setReviewText } = useReviewDraft();
  const hasStore = useReviewDraftGuard() !== null;
  const reviewSave = useReviewSave();
  const requestExit = useReviewFlowExit();

  if (!hasStore) {
    return null;
  }

  return (
    <ReviewStepLayout
      className="gap-ds-24 pt-ds-24"
      footerClassName="pb-ds-20"
      footer={
        <ButtonStack>
          <Button inert={reviewSave.isPending} onClick={() => void reviewSave.complete()}>
            작성 완료
          </Button>
          <Button variant="ghost" size="sm" className="py-ds-4" onClick={requestExit}>
            나중에 추가할게요
          </Button>
        </ButtonStack>
      }
    >
      <StepHeader
        title={
          <>
            이번 방문,
            <br />
            어떠셨어요?
          </>
        }
      />

      <StarRatingField label="방문에 만족하셨나요?" value={rating} onChange={setRating} />

      <Textarea
        label="리뷰를 작성해 주세요"
        value={reviewText}
        onChange={(event) => setReviewText(event.target.value)}
        placeholder="어떤 점이 좋았나요? 편하게 남겨주세요"
        maxLength={MAX_REVIEW_TEXT_LENGTH}
        showCount
        className="min-h-[180px]"
      />
    </ReviewStepLayout>
  );
}
