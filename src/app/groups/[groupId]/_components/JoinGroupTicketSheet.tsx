"use client";

import groupFallbackImage from "@/shared/assets/dummy.png";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import type { GroupJoinAction, GroupJoinInfo } from "../_model/groupDetail";

type JoinGroupTicketSheetProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  group: GroupJoinInfo;
  joinAction: GroupJoinAction;
};

export function JoinGroupTicketSheet({
  open,
  onOpenChangeAction,
  group,
  joinAction,
}: JoinGroupTicketSheetProps) {
  return (
    <BottomSheet
      label="그룹 가입"
      open={open}
      onOpenChange={onOpenChangeAction}
      footer={
        <ButtonStack type="horizontal">
          <Button variant="tertiary" onClick={() => onOpenChangeAction(false)}>
            닫기
          </Button>
          <Button loading={joinAction.isPending} onClick={joinAction.onJoin}>
            가입하기
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
          <p className="text-body-lg-regular text-content-primary">그룹에 가입하시겠어요?</p>
        </div>
        <div className="flex w-full items-center justify-between rounded-ds-md bg-surface-secondary p-ds-16 text-body-lg-medium">
          <span className="text-content-tertiary">보유 티켓</span>
          <span className="text-content-primary">{group.availableTicketCount}</span>
        </div>
      </div>
    </BottomSheet>
  );
}
