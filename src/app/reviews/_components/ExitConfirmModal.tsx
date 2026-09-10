"use client";

import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { Modal } from "@/shared/ui/Modal";

const TITLE = "리뷰 작성을 그만두시겠어요?";

/**
 * 나가기가 남기는 결과가 단계마다 달라 안내 문구가 갈린다.
 * - discard: 초안이 아직 없다. 나가면 입력이 사라진다.
 * - keep: 초안으로 저장된다. 어디서 이어 쓰는지 알려준다.
 *
 * 버튼은 두 경우가 같다. 결과와 무관하게 계속 쓰기를 강조한다.
 */
export type ExitConfirmVariant = "discard" | "keep";

const DESCRIPTIONS = {
  discard: ["지금까지 입력한 내용이 모두 삭제돼요."],
  keep: ["지금까지 쓴 내용은 저장돼요.", "마이페이지 > 내 티켓에서 이어 쓸 수 있어요."],
} satisfies Record<ExitConfirmVariant, readonly string[]>;

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
  const descriptions = DESCRIPTIONS[variant];

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={TITLE}
      showClose={false}
      footer={
        <ButtonStack type="horizontal">
          <Button variant="tertiary" inert={isPending} onClick={() => void onExit()}>
            나가기
          </Button>
          <Button variant="primary" inert={isPending} onClick={() => onOpenChange(false)}>
            계속 작성하기
          </Button>
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
