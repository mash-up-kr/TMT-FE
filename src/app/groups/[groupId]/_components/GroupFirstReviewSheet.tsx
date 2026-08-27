"use client";

import { EmptyNotice } from "@/shared/components/EmptyNotice/EmptyNotice";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";

type GroupFirstReviewSheetProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onWriteReviewAction: () => void;
};

export function GroupFirstReviewSheet({
  open,
  onOpenChangeAction,
  onWriteReviewAction,
}: GroupFirstReviewSheetProps) {
  return (
    <BottomSheet
      label="그룹 첫 리뷰 등록 안내"
      open={open}
      onOpenChange={onOpenChangeAction}
      footer={
        <ButtonStack type="horizontal">
          <Button variant="tertiary" onClick={() => onOpenChangeAction(false)}>
            다음에
          </Button>
          <Button variant="secondary" onClick={onWriteReviewAction}>
            등록하러가기
          </Button>
        </ButtonStack>
      }
    >
      <div className="pb-ds-12">
        <EmptyNotice
          variant="prominent"
          eyebrow="아직 게시된 리뷰가 없어요."
          title={"그룹 첫 리뷰를\n등록해보세요!"}
        />
      </div>
    </BottomSheet>
  );
}
