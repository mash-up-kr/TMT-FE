"use client";

import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { Modal } from "@/shared/ui/Modal";
import type { GroupDeleteAction } from "../_model/groupEdit";

const TITLE = "그룹을 삭제하시겠어요?";
const DESCRIPTION = "등록된 리뷰가 모두 삭제돼요";

type GroupDeleteModalProps = Readonly<{
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  deleteAction: GroupDeleteAction;
}>;

export function GroupDeleteModal({
  open,
  onOpenChangeAction,
  deleteAction,
}: GroupDeleteModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChangeAction}
      title={TITLE}
      showClose={false}
      footer={
        <ButtonStack type="horizontal">
          <Button
            disabled={deleteAction.isPending}
            variant="tertiary"
            onClick={() => onOpenChangeAction(false)}
          >
            취소
          </Button>
          <Button loading={deleteAction.isPending} onClick={deleteAction.onDeleteAction}>
            삭제
          </Button>
        </ButtonStack>
      }
    >
      <div className="flex flex-col gap-ds-8 pt-ds-20 text-center">
        <p aria-hidden="true" className="text-heading-md text-content-primary">
          {TITLE}
        </p>
        <p className="text-body-lg-medium text-content-tertiary">{DESCRIPTION}</p>
      </div>
    </Modal>
  );
}
