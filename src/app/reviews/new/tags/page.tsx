"use client";

import { useRouter } from "next/navigation";
import { useReviewFormConfig } from "@/api/gen/review-write/review-write.gen";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { StepHeader } from "../_components/StepHeader";
import { TagGroupField } from "../_components/TagGroupField";
import { reviewStepPath } from "../_constants/steps";
import { useReviewDraftGuard } from "../_hooks/useReviewDraftGuard";
import type { ReviewTagGroup } from "../_model/tag";
import { useReviewDraft } from "../_stores/ReviewDraftProvider";
import { mapReviewTags } from "../_utils/reviewApiMappers";

const TAG_GROUPS: Omit<ReviewTagGroup, "tags">[] = [
  { id: "companion", label: "누구와 함께했나요?", hint: "(복수 가능)" },
  { id: "highlight", label: "어떤 점이 좋았나요?", hint: "(복수 가능)" },
];

export default function TagsStepPage() {
  const router = useRouter();
  const { selectedTagIds, toggleTag } = useReviewDraft();
  const hasStore = useReviewDraftGuard();
  const formConfig = useReviewFormConfig();

  const tagGroups: ReviewTagGroup[] = [
    { ...TAG_GROUPS[0], tags: mapReviewTags(formConfig.data?.companionTags) },
    { ...TAG_GROUPS[1], tags: mapReviewTags(formConfig.data?.positivePointTags) },
  ];

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
              어떤 자리였어요?
            </>
          }
        />

        {formConfig.isLoading && (
          <p role="status" className="text-body-md-medium text-content-tertiary">
            태그를 불러오는 중이에요.
          </p>
        )}
        {formConfig.isError && (
          <p role="status" className="text-body-md-medium text-content-error">
            태그를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
          </p>
        )}
        {formConfig.isSuccess &&
          tagGroups.map((group) => (
            <TagGroupField
              key={group.id}
              group={group}
              selectedTagIds={selectedTagIds}
              onToggle={toggleTag}
            />
          ))}
      </div>

      <div className="content-container pt-ds-12 pb-ds-32">
        <ButtonStack>
          <Button onClick={() => router.push(reviewStepPath("rating"))}>다음</Button>
        </ButtonStack>
      </div>
    </>
  );
}
