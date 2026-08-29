"use client";

import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { useReviewDraftGuard } from "../../_hooks/useReviewDraftGuard";
import { useReviewSave } from "../../_hooks/useReviewSave";
import { useReviewDraft } from "../../_stores/ReviewDraftProvider";
import { PhotoPicker } from "../PhotoPicker";
import { StepHeader } from "../StepHeader";

export function PhotosStep() {
  const { photos, addPhotos, removePhoto } = useReviewDraft();
  const hasStore = useReviewDraftGuard() !== null;
  const reviewSave = useReviewSave();

  if (!hasStore) {
    return null;
  }

  return (
    <>
      <div className="content-container flex flex-1 flex-col gap-ds-24 pt-ds-24">
        <StepHeader
          required
          title={
            <>
              그날의 순간,
              <br />
              사진으로 남겨볼까요?
            </>
          }
        />

        <PhotoPicker
          photos={photos}
          onAdd={addPhotos}
          onRemove={removePhoto}
          disabled={reviewSave.isPending}
        />
      </div>

      <div className="content-container pt-ds-12 pb-ds-32">
        <ButtonStack>
          <Button
            loading={reviewSave.isPending}
            disabled={photos.length === 0}
            onClick={() => void reviewSave.saveAndGo("tags")}
          >
            다음
          </Button>
        </ButtonStack>
      </div>
    </>
  );
}
