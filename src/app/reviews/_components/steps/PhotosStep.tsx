"use client";

import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { useReviewDraftGuard } from "../../_hooks/useReviewDraftGuard";
import { useReviewSave } from "../../_hooks/useReviewSave";
import { useReviewDraft } from "../../_stores/ReviewDraftProvider";
import { PhotoPicker } from "../PhotoPicker";
import { useReviewFlowExit } from "../ReviewFlowShell";
import { ReviewStepLayout } from "../ReviewStepLayout";
import { StepHeader } from "../StepHeader";

export function PhotosStep() {
  const { photos, addPhotos, removePhoto } = useReviewDraft();
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
          <Button inert={reviewSave.isPending} onClick={() => void reviewSave.saveAndGo("tags")}>
            다음
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
            그날의 순간,
            <br />
            사진으로 남겨볼까요?
          </>
        }
      />

      <PhotoPicker photos={photos} onAdd={addPhotos} onRemove={removePhoto} />
    </ReviewStepLayout>
  );
}
