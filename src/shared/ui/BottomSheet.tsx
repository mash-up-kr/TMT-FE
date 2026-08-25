"use client";

import { Drawer } from "@base-ui/react/drawer";
import type { ReactNode } from "react";
import { GNB } from "@/shared/ui/GNB";
import { cn } from "@/shared/utils/cn";

type SheetHeight = "content" | "fixed";

const heightStyles = {
  content: "max-h-(--layout-sheet-box-height)",
  fixed: "h-(--layout-sheet-box-height)",
} satisfies Record<SheetHeight, string>;

type BottomSheetBaseProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 시트 높이. `content`는 내용만큼, `fixed`는 시안 높이로 고정한다. */
  height?: SheetHeight;
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
 * 헤더가 있으면 `title`이 그 역할을 겸하고, 헤더가 없을 때만 `label`로 따로 준다.
 * 둘을 함께 주면 보이는 제목과 낭독 이름이 갈려 WCAG 2.5.3에 어긋나므로 타입으로 막는다.
 */
type BottomSheetNameProps = Readonly<
  | {
      /** 헤더 제목. 시트 이름도 겸한다. */
      title: string;
      label?: undefined;
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
 * 스와이프로 닫는 동작은 Base UI Drawer가 시트 전체에서 처리한다. 상단 핸들은 장식이다.
 *
 * 헤더로 GNB를 쓰므로 시트 이름은 `Drawer.Title` 대신 팝업 `aria-label`로 건다. Base UI는
 * Title이 없으면 `aria-labelledby`를 붙이지 않아 충돌하지 않는다.
 *
 * @example
 * <BottomSheet title="메뉴 34" right={<CloseButton />}>…</BottomSheet>
 * <BottomSheet label="추천 결과">…</BottomSheet>
 */
export function BottomSheet({
  open,
  onOpenChange,
  height = "content",
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
            "fixed inset-0 z-overlay bg-surface-backdrop",
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
              heightStyles[height],
              "-mb-(--layout-sheet-overscroll) pb-(--layout-sheet-overscroll)",
              "transition-transform duration-300 ease-out",
              "data-starting-style:translate-y-full data-ending-style:translate-y-full",
              // 드래그 중 위치는 Base UI가 인라인 transform으로 잡는다. 전환을 켜두면 손가락보다
              // 늦게 따라오고, translate로 관여하면 그 인라인 값과 충돌한다.
              "data-swiping:duration-0",
              "data-ending-style:duration-[calc(var(--drawer-swipe-strength)*0.4s)]",
              className,
            )}
          >
            {/* 마우스·펜에서 본문 텍스트 선택이 스와이프로 오인되지 않게 하는 Base UI 파트다. */}
            <Drawer.Content className="flex min-h-0 flex-1 flex-col">
              <div aria-hidden="true" className="flex shrink-0 justify-center py-ds-12">
                {/* 시안 36x4. ds 스케일에 36이 없어 기본 스케일을 쓴다. */}
                <div className="h-1 w-9 rounded-ds-full bg-stroke-primary" />
              </div>

              {title ? (
                <GNB align="left" title={title} left={left} right={right} className="shrink-0" />
              ) : null}

              <div
                className={cn(
                  // min-h-0이 빠지면 본문이 줄지 않아 시트가 max-h를 넘긴다.
                  "flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-ds-20 pt-ds-12",
                  !footer && "pb-ds-20",
                )}
              >
                {children}
              </div>

              {footer ? <div className="shrink-0 px-ds-20 pt-ds-12 pb-ds-32">{footer}</div> : null}
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
