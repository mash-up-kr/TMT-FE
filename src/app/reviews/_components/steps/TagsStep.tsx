"use client";

import { useReviewFormConfig } from "@/api/gen/review-write/review-write.gen";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { useReviewDraftGuard } from "../../_hooks/useReviewDraftGuard";
import { useReviewSave } from "../../_hooks/useReviewSave";
import { useReviewDraft } from "../../_stores/ReviewDraftProvider";
import { mapReviewTagGroups } from "../../_utils/reviewApiMappers";
import { StatusMessage } from "../StatusMessage";
import { StepHeader } from "../StepHeader";
import { TagGroupField } from "../TagGroupField";

const LOADING_MESSAGE = "태그를 불러오는 중이에요";
const ERROR_MESSAGE = "태그를 불러오지 못했어요. 잠시 후 다시 시도해 주세요";

export function TagsStep() {
  const { selectedTagIds, toggleTag } = useReviewDraft();
  const hasStore = useReviewDraftGuard() !== null;
  const formConfig = useReviewFormConfig();
  const reviewSave = useReviewSave();

  const tagGroups = mapReviewTagGroups(formConfig.data);

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

        {formConfig.isLoading && <StatusMessage>{LOADING_MESSAGE}</StatusMessage>}
        {formConfig.isError && <StatusMessage tone="error">{ERROR_MESSAGE}</StatusMessage>}
        {formConfig.isSuccess &&
          tagGroups.map((group) => (
            <TagGroupField
              key={group.id}
              group={group}
              selectedTagIds={selectedTagIds}
              onToggle={toggleTag}
              disabled={reviewSave.isPending}
            />
          ))}
      </div>

      <div className="content-container pt-ds-12 pb-ds-32">
        <ButtonStack>
          <Button
            loading={reviewSave.isPending}
            disabled={!formConfig.isSuccess}
            onClick={() => void reviewSave.saveAndGo("rating")}
          >
            다음
          </Button>
        </ButtonStack>
      </div>
    </>
  );
}
