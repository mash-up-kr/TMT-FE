"use client";

import { Drawer } from "@base-ui/react/drawer";
import type { ReactNode } from "react";
import { GNB } from "@/shared/ui/GNB";
import { cn } from "@/shared/utils/cn";

type BottomSheetBaseProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 헤더 좌측 슬롯. */
  left?: ReactNode;
  /** 헤더 우측 슬롯. */
  right?: ReactNode;
  /** 본문. 넘치면 이 영역만 스크롤한다. */
  children?: ReactNode;
  /** CTA 영역. 스크롤 밖 하단에 고정된다. 버튼 배치는 호출부가 정한다. */
  footer?: ReactNode;
  className?: string;
}>;

/**
 * 시트 이름은 스크린리더가 읽어야 하므로 어느 경우든 하나는 있어야 한다.
 * 헤더가 있으면 `title`이 그 역할을 겸하고, 헤더가 없으면 `label`로 따로 준다.
 */
type BottomSheetNameProps = Readonly<
  | {
      /** 헤더 제목. 시트 이름도 겸한다. */
      title: string;
      /** 낭독용 이름을 제목과 다르게 할 때만 쓴다. */
      label?: string;
    }
  | {
      title?: undefined;
      /** 헤더가 없을 때 스크린리더가 읽을 시트 이름. */
      label: string;
    }
>;

type BottomSheetProps = BottomSheetBaseProps & BottomSheetNameProps;

/**
 * 하단에서 올라오는 시트.
 *
 * 아래로 스와이프해 닫는 동작은 Base UI Drawer가 시트 전체에서 처리한다. 상단 핸들은
 * 그 동작을 알리는 장식이라 별도 핸들러가 없다.
 *
 * 헤더는 GNB를 그대로 쓴다. 시트 이름은 `Drawer.Title` 대신 팝업의 `aria-label`로 거는데,
 * Base UI는 Title이 없으면 `aria-labelledby`를 붙이지 않아 서로 충돌하지 않는다.
 *
 * 시트 헤더는 항상 제목이 있다. GNB가 제목 없을 때 로고로 폴백하는 경로는 페이지 전용이라
 * 여기서는 닿지 않는다. 헤더가 아예 없는 시트는 `title` 대신 `label`을 넘긴다.
 *
 * @example
 * <BottomSheet title="메뉴 34" right={<CloseButton />}>…</BottomSheet>
 * <BottomSheet label="추천 결과">…</BottomSheet>
 */
export function BottomSheet({
  open,
  onOpenChange,
  label,
  title,
  left,
  right,
  children,
  footer,
  className,
}: BottomSheetProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Backdrop
          className={cn(
            "fixed inset-0 bg-surface-backdrop",
            "transition-opacity duration-300 ease-out",
            "data-starting-style:opacity-0 data-ending-style:opacity-0",
            "data-swiping:duration-0",
            "data-ending-style:duration-[calc(var(--drawer-swipe-strength)*0.4s)]",
          )}
        />
        <Drawer.Viewport className="sheet-viewport">
          <Drawer.Popup
            aria-label={label ?? title}
            className={cn(
              "flex w-full flex-col overflow-hidden rounded-t-ds-xl bg-surface-primary shadow-modal",
              // 화면을 넘지 않게 잡는다. dvh라야 iOS 주소창 높이가 빠진다.
              "max-h-[85dvh]",
              // 배경을 화면 아래로 늘려 둔다. 위로 끌어올린 동안 시트 아래에 빈 자리가 생기지
              // 않고, 하단 safe-area도 이 여유분이 덮는다. 음수 마진으로 레이아웃 높이는 되돌린다.
              "-mb-ds-64 pb-ds-64",
              // 등장·퇴장은 아래에서 올라오고 내려간다.
              "transition-transform duration-300 ease-out",
              "data-starting-style:translate-y-full data-ending-style:translate-y-full",
              // 드래그 중에는 전환을 꺼야 손가락에 1:1로 붙는다. 이때 위치는 Base UI가
              // 인라인 transform으로 직접 잡으므로 우리가 translate로 관여하지 않는다.
              "data-swiping:duration-0",
              // 놓을 때는 스와이프 속도에 비례해 미끄러진다.
              "data-ending-style:duration-[calc(var(--drawer-swipe-strength)*0.4s)]",
              className,
            )}
          >
            {/* 마우스·펜에서 본문 텍스트 선택이 스와이프로 오인되지 않게 하는 Base UI 파트다. */}
            <Drawer.Content className="flex min-h-0 flex-1 flex-col">
              <div aria-hidden="true" className="flex shrink-0 justify-center py-ds-12">
                {/* 36×4. ds 스케일에 36이 없어 임의값으로 둔다. */}
                <div className="h-1 w-9 rounded-ds-full bg-stroke-primary" />
              </div>

              {title ? (
                <GNB align="left" title={title} left={left} right={right} className="shrink-0" />
              ) : null}

              <div
                className={cn(
                  // 시트가 max-h를 넘긴다.
                  "flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-ds-20",
                  !footer && "pb-ds-20",
                )}
              >
                {children}
              </div>

              {/* 하단 32는 홈 인디케이터를 피하려는 시안 값이다. */}
              {footer ? <div className="shrink-0 px-ds-20 pt-ds-12 pb-ds-32">{footer}</div> : null}
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
