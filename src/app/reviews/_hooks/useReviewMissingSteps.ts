"use client";

import { useReviewFormConfig } from "@/api/gen/review-write/review-write.gen";
import type { ReviewMissingStep, ReviewMissingStepSegment } from "../_model/save";
import { useReviewDraft } from "../_stores/ReviewDraftProvider";
import { toEmptyReviewSteps, toReviewMissingSteps } from "../_utils/reviewMissingSteps";

/** 남은 항목을 아직 모를 때 "이어서 채우기"가 향할 곳. 티켓 조건이 걸린 첫 단계다. */
const DEFAULT_NEXT_STEP: ReviewMissingStepSegment = "tags";

/**
 * 완료 화면이 안내할 남은 항목과, 이어서 채울 단계.
 *
 * 저장 응답의 `missing`이 정본이지만 그 응답은 방금 저장한 화면에만 남는다. 새로고침이나
 * 재진입으로 응답이 없으면 복원된 초안에서 비어 있는 단계를 대신 센다.
 */
export function useReviewMissingSteps(): {
  missingSteps: ReviewMissingStep[];
  nextStep: ReviewMissingStepSegment;
} {
  const { saveResult, selectedTagIds, rating, reviewText } = useReviewDraft();
  const formConfig = useReviewFormConfig();

  const missingSteps =
    saveResult !== null
      ? toReviewMissingSteps(saveResult.missingItems)
      : toEmptyReviewSteps({
          // 태그 구성을 받기 전에는 고른 태그가 어느 묶음인지 알 수 없다. 틀린 항목을 잠깐
          // 보여주느니 항목 없이 두고, 구성이 도착하면 그때 센다.
          tags:
            formConfig.data !== undefined &&
            (!hasSelected(formConfig.data.companionTags, selectedTagIds) ||
              !hasSelected(formConfig.data.positivePointTags, selectedTagIds)),
          rating: rating <= 0 || reviewText.trim().length === 0,
        });

  return { missingSteps, nextStep: missingSteps.at(0)?.step ?? DEFAULT_NEXT_STEP };
}

function hasSelected(tags: readonly { tagId: string }[], selectedTagIds: ReadonlySet<string>) {
  return tags.some((tag) => selectedTagIds.has(tag.tagId));
}
