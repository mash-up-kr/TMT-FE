"use client";

import { EmptyNotice } from "@/shared/components/EmptyNotice/EmptyNotice";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";

type ContinueDraftSheetProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onContinueAction: () => void;
  /**
   * 왼쪽 버튼. 없으면 시트를 닫는 `닫기`다.
   *
   * 그룹에서 리뷰를 쓰러 온 사람은 이미 쓰기로 한 상태라 닫을 게 아니라 `새로 작성하기`를 고른다.
   * 문구와 동작을 한 덩어리로 받아 둘 중 하나만 바꾸는 실수를 막는다.
   */
  secondaryAction?: Readonly<{ label: string; onClick: () => void }>;
};

/**
 * 쓰다 만 리뷰가 있을 때 이어 쓸지 묻는 시트. 마이페이지 진입과 그룹의 티켓 부족 시트가 함께 쓴다.
 */
export function ContinueDraftSheet({
  open,
  onOpenChangeAction,
  onContinueAction,
  secondaryAction,
}: ContinueDraftSheetProps) {
  return (
    <BottomSheet
      label="작성 중인 리뷰 이어쓰기 안내"
      open={open}
      onOpenChange={onOpenChangeAction}
      footer={
        <ButtonStack type="horizontal">
          {secondaryAction ? (
            <Button variant="tertiary" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          ) : (
            <Button variant="tertiary" onClick={() => onOpenChangeAction(false)}>
              닫기
            </Button>
          )}
          <Button variant="secondary" onClick={onContinueAction}>
            이어서 작성하기
          </Button>
        </ButtonStack>
      }
    >
      <div className="pb-ds-12">
        <EmptyNotice
          variant="prominent"
          illustration="writing"
          eyebrow="작성 중인 리뷰가 있어요"
          title={"리뷰를 이어서\n작성하시겠어요?"}
        />
      </div>
    </BottomSheet>
  );
}
