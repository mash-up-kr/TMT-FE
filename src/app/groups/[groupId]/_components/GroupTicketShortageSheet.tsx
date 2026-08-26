"use client";

import groupFallbackImage from "@/shared/assets/dummy.png";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import type { GroupJoinInfo } from "../_model/groupDetail";

type GroupTicketShortageSheetProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onWriteReviewAction: () => void;
  group: GroupJoinInfo;
};

export function GroupTicketShortageSheet({
  open,
  onOpenChangeAction,
  onWriteReviewAction,
  group,
}: GroupTicketShortageSheetProps) {
  return (
    <BottomSheet
      label="그룹 가입 안내"
      open={open}
      onOpenChange={onOpenChangeAction}
      footer={
        <ButtonStack type="horizontal">
          <Button variant="tertiary" onClick={() => onOpenChangeAction(false)}>
            닫기
          </Button>
          <Button variant="secondary" onClick={onWriteReviewAction}>
            리뷰 작성하기
          </Button>
        </ButtonStack>
      }
    >
      <div className="flex flex-col items-center gap-ds-12 text-center">
        <ImageWithFallback
          src={group.imageUrl}
          fallbackSrc={groupFallbackImage}
          alt=""
          className="size-[60px] rounded-ds-full object-cover"
        />
        <div className="flex w-full flex-col gap-ds-8">
          <h2 className="text-heading-lg text-content-primary">{group.name}</h2>
          <p className="text-body-lg-regular text-content-error">
            그룹 가입에 필요한 티켓이 부족해요!
          </p>
        </div>
        <div className="flex w-full items-center justify-between rounded-ds-md bg-surface-secondary p-ds-16 text-body-lg-medium">
          <span className="text-content-tertiary">보유 티켓</span>
          <span className="text-content-error">{group.availableTicketCount}</span>
        </div>
      </div>
    </BottomSheet>
  );
}
