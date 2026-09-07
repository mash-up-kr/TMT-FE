"use client";

import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { Modal } from "@/shared/ui/Modal";

const TITLE = "로그아웃 하시겠어요?";

type LogoutConfirmModalProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogout: () => void;
}>;

export function LogoutConfirmModal({ open, onOpenChange, onLogout }: LogoutConfirmModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={TITLE}
      showClose={false}
      footer={
        <ButtonStack type="horizontal">
          <Button variant="tertiary" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={onLogout}>로그아웃</Button>
        </ButtonStack>
      }
    >
      <div className="pt-ds-20 text-center">
        <p aria-hidden="true" className="text-heading-md text-content-primary">
          {TITLE}
        </p>
      </div>
    </Modal>
  );
}
