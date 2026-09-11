"use client";

import writingMascot from "@/shared/components/assets/mascot-writing.png";

import { EmptyNotice } from "@/shared/components/EmptyNotice/EmptyNotice";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";

type GroupReviewEntrySheetProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  /** 이미 쓴 내 리뷰 중에서 골라 공유한다. */
  onShareAction: () => void;
  /** 새 리뷰를 써서 그룹에 올린다. */
  onWriteNewAction: () => void;
};

/**
 * 그룹 상세의 `+`를 눌렀을 때 리뷰를 어떻게 남길지 고르는 시트.
 *
 * 공유할 내 리뷰가 하나라도 있을 때만 뜬다. 없으면 고를 게 없으니 시트 없이 바로 새로 쓰기로
 * 보낸다. 그 판단은 상세 화면이 한다.
 */
export function GroupReviewEntrySheet({
  open,
  onOpenChangeAction,
  onShareAction,
  onWriteNewAction,
}: GroupReviewEntrySheetProps) {
  return (
    <BottomSheet
      label="그룹에 리뷰 남기기"
      open={open}
      onOpenChange={onOpenChangeAction}
      footer={
        <ButtonStack type="horizontal">
          <Button variant="tertiary" onClick={onShareAction}>
            공유하기
          </Button>
          <Button variant="primary" onClick={onWriteNewAction}>
            새로 작성하기
          </Button>
        </ButtonStack>
      }
    >
      <div className="pb-ds-12">
        <EmptyNotice src={writingMascot} title={"그룹에 리뷰를\n어떻게 남길까요?"}>
          이미 쓴 리뷰를 공유하거나 새로 작성할 수 있어요
        </EmptyNotice>
      </div>
    </BottomSheet>
  );
}
