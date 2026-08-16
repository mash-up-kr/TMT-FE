"use client";

import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { Modal } from "@/shared/ui/Modal";

const TITLE = "리뷰 작성을 그만두시겠어요?";

type ExitConfirmModalProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExit: () => void;
}>;

export function ExitConfirmModal({ open, onOpenChange, onExit }: ExitConfirmModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={TITLE}
      showClose={false}
      footer={
        <ButtonStack type="horizontal">
          <Button variant="tertiary" onClick={onExit}>
            나가기
          </Button>
          <Button onClick={() => onOpenChange(false)}>계속 작성하기</Button>
        </ButtonStack>
      }
    >
      <div className="flex flex-col gap-ds-8 pt-ds-32 text-center">
        {/* Dialog.Title이 같은 문장을 이름으로 이미 제공한다. 중복 낭독을 막고 시안 타이포만 살린다. */}
        <p aria-hidden="true" className="text-heading-md text-content-primary">
          {TITLE}
        </p>
        <p className="text-body-lg-medium text-content-tertiary">
          지금까지 입력한 내용이 모두 삭제돼요.
        </p>
      </div>
    </Modal>
  );
}
