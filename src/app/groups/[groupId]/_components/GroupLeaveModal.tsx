"use client";

import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { Modal } from "@/shared/ui/Modal";
import type { GroupLeaveAction } from "../_model/groupDetail";

const TITLE = "그룹을 탈퇴하시겠어요?";
const DESCRIPTION = "이 그룹에 공유한 내 리뷰가 함께 사라지고,\n다시 들어오려면 티켓이 필요해요.";

type GroupLeaveModalProps = Readonly<{
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  leaveAction: GroupLeaveAction;
}>;

export function GroupLeaveModal({ open, onOpenChangeAction, leaveAction }: GroupLeaveModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChangeAction}
      title={TITLE}
      showClose={false}
      footer={
        <ButtonStack type="horizontal">
          <Button
            disabled={leaveAction.isPending}
            variant="tertiary"
            onClick={() => onOpenChangeAction(false)}
          >
            취소
          </Button>
          <Button loading={leaveAction.isPending} onClick={leaveAction.onLeaveAction}>
            나가기
          </Button>
        </ButtonStack>
      }
    >
      <div className="flex flex-col gap-ds-8 pt-ds-20 text-center">
        <p aria-hidden="true" className="text-heading-md text-content-primary">
          {TITLE}
        </p>
        <p className="whitespace-pre-line text-body-lg-medium text-content-tertiary">
          {DESCRIPTION}
        </p>
      </div>
    </Modal>
  );
}
