"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { PhotoPicker } from "../_components/PhotoPicker";
import { StepHeader } from "../_components/StepHeader";
import { reviewStepPath } from "../_constants/steps";
import { useReviewDraftGuard } from "../_hooks/useReviewDraftGuard";
import { useReviewDraft } from "../_stores/ReviewDraftProvider";
import { useReviewFlowBase } from "../_stores/ReviewFlowBaseProvider";

export default function PhotosStepPage() {
  const router = useRouter();
  const basePath = useReviewFlowBase();
  const { photos, addPhotos, removePhoto } = useReviewDraft();
  const hasStore = useReviewDraftGuard() !== null;

  if (!hasStore) {
    return null;
  }

  return (
    <>
      <div className="content-container flex flex-1 flex-col gap-ds-24 pt-ds-24">
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
      </div>

      <div className="content-container pt-ds-12 pb-ds-32">
        <ButtonStack>
          <Button onClick={() => router.push(reviewStepPath(basePath, "tags"))}>다음</Button>
        </ButtonStack>
      </div>
    </>
  );
}
