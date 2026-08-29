"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { Textarea } from "@/shared/ui/TextField";
import { MAX_REVIEW_TEXT_LENGTH } from "../../_constants/review";
import { reviewCompletePath } from "../../_constants/steps";
import { useReviewDraftGuard } from "../../_hooks/useReviewDraftGuard";
import { useSubmitReview } from "../../_hooks/useSubmitReview";
import { useReviewDraft } from "../../_stores/ReviewDraftProvider";
import { useReviewFlowBase } from "../../_stores/ReviewFlowBaseProvider";
import { StarRatingField } from "../StarRatingField";
import { StepHeader } from "../StepHeader";

export function RatingStep() {
  const router = useRouter();
  const basePath = useReviewFlowBase();
  const { rating, setRating, reviewText, setReviewText } = useReviewDraft();
  const hasStore = useReviewDraftGuard() !== null;
  const { submit, isPending, isReady } = useSubmitReview();

  if (!hasStore) {
    return null;
  }

  const handleSubmit = async () => {
    if (await submit()) {
      router.replace(reviewCompletePath(basePath));
    }
  };

  return (
    <>
      <div className="content-container flex flex-1 flex-col gap-ds-24 pt-ds-24">
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
          className="min-h-[154px]"
        />
      </div>

      <div className="content-container pt-ds-12 pb-ds-32">
        <ButtonStack>
          <Button loading={isPending} disabled={!isReady} onClick={handleSubmit}>
            다음
          </Button>
        </ButtonStack>
      </div>
    </>
  );
}
