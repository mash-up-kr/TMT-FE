"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { StepHeader } from "../_components/StepHeader";
import { TagGroupField } from "../_components/TagGroupField";
import { REVIEW_FLOW_BASE_PATH } from "../_constants/steps";
import { REVIEW_TAG_GROUPS } from "../_constants/tags";
import { useReviewDraftGuard } from "../_hooks/useReviewDraftGuard";
import { useReviewDraft } from "../_stores/ReviewDraftProvider";

export default function TagsStepPage() {
  const router = useRouter();
  const { selectedTagIds, toggleTag } = useReviewDraft();
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
              어떤 자리였어요?
            </>
          }
        />

        {REVIEW_TAG_GROUPS.map((group) => (
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
          {/* 선택 단계라 아무것도 고르지 않아도 넘어간다. */}
          <Button onClick={() => router.push(`${REVIEW_FLOW_BASE_PATH}/rating`)}>다음</Button>
        </ButtonStack>
      </div>
    </>
  );
}
