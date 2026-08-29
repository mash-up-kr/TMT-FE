"use client";

import { EmptyNotice } from "@/shared/components/EmptyNotice/EmptyNotice";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";

type ContinueDraftSheetProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onContinueAction: () => void;
};

export function ContinueDraftSheet({
  open,
  onOpenChangeAction,
  onContinueAction,
}: ContinueDraftSheetProps) {
  return (
    <BottomSheet
      label="작성 중인 리뷰 이어쓰기 안내"
      open={open}
      onOpenChange={onOpenChangeAction}
      footer={
        <ButtonStack type="horizontal">
          <Button variant="tertiary" onClick={() => onOpenChangeAction(false)}>
            닫기
          </Button>
          <Button variant="secondary" onClick={onContinueAction}>
            이어서 작성하기
          </Button>
        </ButtonStack>
      }
    >
      <div className="pb-ds-12">
        <EmptyNotice
          variant="prominent"
          illustration="writing"
          eyebrow="작성 중인 리뷰가 있어요"
          title={"리뷰를 이어서\n작성하시겠어요?"}
        />
      </div>
    </BottomSheet>
  );
}
