"use client";

import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { Modal } from "@/shared/ui/Modal";

const TITLE = "리뷰 작성을 그만두시겠어요?";

/**
 * 나가기가 남기는 결과가 단계마다 달라 문구와 버튼 강조가 갈린다.
 * - discard: 초안이 아직 없다. 나가면 입력이 사라지므로 계속 쓰기를 강조한다.
 * - keep: 초안으로 저장된다. 나가기를 강조하고 어디서 이어 쓰는지 알려준다.
 */
export type ExitConfirmVariant = "discard" | "keep";

const COPY = {
  discard: {
    descriptions: ["지금까지 입력한 내용이 모두 삭제돼요."],
    cancelLabel: "계속 작성하기",
    emphasizeExit: false,
  },
  keep: {
    descriptions: ["지금까지 쓴 내용은 저장돼요.", "마이페이지 > 내 티켓에서 이어 쓸 수 있어요."],
    cancelLabel: "취소",
    emphasizeExit: true,
  },
} satisfies Record<
  ExitConfirmVariant,
  { descriptions: readonly string[]; cancelLabel: string; emphasizeExit: boolean }
>;

type ExitConfirmModalProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: ExitConfirmVariant;
  onExit: () => void | Promise<void>;
  isPending: boolean;
}>;

export function ExitConfirmModal({
  open,
  onOpenChange,
  variant,
  onExit,
  isPending,
}: ExitConfirmModalProps) {
  const { descriptions, cancelLabel, emphasizeExit } = COPY[variant];

  const exitButton = (
    <Button
      key="exit"
      variant={emphasizeExit ? "primary" : "tertiary"}
      inert={isPending}
      onClick={() => void onExit()}
    >
      나가기
    </Button>
  );
  const cancelButton = (
    <Button
      key="cancel"
      variant={emphasizeExit ? "tertiary" : "primary"}
      inert={isPending}
      onClick={() => onOpenChange(false)}
    >
      {cancelLabel}
    </Button>
  );

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={TITLE}
      showClose={false}
      footer={
        <ButtonStack type="horizontal">
          {emphasizeExit ? [cancelButton, exitButton] : [exitButton, cancelButton]}
        </ButtonStack>
      }
    >
      <div className="flex flex-col gap-ds-8 pt-ds-32 text-center">
        <p aria-hidden="true" className="text-heading-md text-content-primary">
          {TITLE}
        </p>
        <p className="text-body-lg-medium text-content-tertiary">
          {descriptions.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>
    </Modal>
  );
}
