"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { PhotoPicker } from "../_components/PhotoPicker";
import { StepHeader } from "../_components/StepHeader";
import { REVIEW_FLOW_BASE_PATH } from "../_constants/steps";
import { useReviewDraftGuard } from "../_hooks/useReviewDraftGuard";
import { useReviewDraft } from "../_stores/ReviewDraftProvider";

export default function PhotosStepPage() {
  const router = useRouter();
  const { photos, addPhotos, removePhoto } = useReviewDraft();
  const hasStore = useReviewDraftGuard();

  // 1단계로 돌아가는 중이다. 빈 화면을 잠깐 보여주는 편이 매장 없는 입력을 받는 것보다 낫다.
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
          {/* 선택 단계라 사진이 없어도 넘어간다 (시안 주석: 기본으로 활성화 상태 설정). */}
          <Button onClick={() => router.push(`${REVIEW_FLOW_BASE_PATH}/tags`)}>다음</Button>
        </ButtonStack>
      </div>
    </>
  );
}
