"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { Textarea } from "@/shared/ui/TextField";
import { StarRatingField } from "../_components/StarRatingField";
import { StepHeader } from "../_components/StepHeader";
import { REVIEW_COMPLETE_PATH } from "../_constants/steps";
import { useReviewDraftGuard } from "../_hooks/useReviewDraftGuard";
import { useReviewDraft } from "../_stores/ReviewDraftProvider";

const MAX_REVIEW_TEXT_LENGTH = 500;

export default function RatingStepPage() {
  const router = useRouter();
  const { rating, setRating, reviewText, setReviewText } = useReviewDraft();
  const hasStore = useReviewDraftGuard();

  if (!hasStore) {
    return null;
  }

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
          <Button onClick={() => router.replace(REVIEW_COMPLETE_PATH)}>다음</Button>
        </ButtonStack>
      </div>
    </>
  );
}
