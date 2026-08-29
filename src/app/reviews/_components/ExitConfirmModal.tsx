"use client";

import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { Modal } from "@/shared/ui/Modal";

const TITLE = "리뷰 작성을 그만두시겠어요?";

type ExitConfirmModalProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExit: () => Promise<void>;
  isPending: boolean;
  excludesPhotos: boolean;
}>;

export function ExitConfirmModal({
  open,
  onOpenChange,
  onExit,
  isPending,
  excludesPhotos,
}: ExitConfirmModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={TITLE}
      showClose={false}
      footer={
        <ButtonStack type="horizontal">
          <Button variant="tertiary" disabled={isPending} onClick={() => onOpenChange(false)}>
            계속 작성하기
          </Button>
          <Button loading={isPending} onClick={() => void onExit()}>
            저장하고 나가기
          </Button>
        </ButtonStack>
      }
    >
      <div className="flex flex-col gap-ds-8 pt-ds-32 text-center">
        <p aria-hidden="true" className="text-heading-md text-content-primary">
          {TITLE}
        </p>
        <p className="text-body-lg-medium text-content-tertiary">
          {excludesPhotos
            ? "사진을 제외한 입력 내용을 저장하고 나갈게요."
            : "지금까지 입력한 내용을 저장하고 나갈게요."}
        </p>
      </div>
    </Modal>
  );
}
