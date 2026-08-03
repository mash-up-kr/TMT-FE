"use client";

import { Drawer } from "@base-ui/react/drawer";
import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

type BottomSheetProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 시트 제목. 스크린리더가 읽는 이름이므로 값은 항상 필요하다. */
  title: string;
  /** 제목을 화면에도 노출한다. */
  titleVisible?: boolean;
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
 * 하단에서 올라오는 시트.
 *
 * 아래로 스와이프해 닫는 동작은 Base UI Drawer가 시트 전체에서 처리한다. 상단 핸들은
 * 그 동작을 알리는 장식이라 별도 핸들러가 없다.
 *
 * 헤더는 GNB와 생김새가 같지만 컴포넌트를 재사용하지 않는다. 제목을 `Drawer.Title`로
 * 걸어야 스크린리더가 시트 이름을 읽고, 제목이 없을 때 로고로 폴백해서도 안 된다.
 */
export function BottomSheet({
  open,
  onOpenChange,
  title,
  titleVisible = true,
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
            "data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)]",
          )}
        />
        <Drawer.Viewport className="sheet-viewport">
          <Drawer.Popup
            className={cn(
              "flex w-full flex-col overflow-hidden rounded-t-ds-xl bg-surface-primary shadow-modal",
              // 화면을 넘지 않게 잡는다. dvh라야 iOS 주소창 높이가 빠진다.
              "max-h-[85dvh]",
              // 등장·퇴장은 아래에서 올라오고 내려간다.
              "transition-transform duration-300 ease-out",
              "data-starting-style:translate-y-full data-ending-style:translate-y-full",
              // 드래그 중에는 전환을 꺼야 손가락에 1:1로 붙는다. 이때 위치는 Base UI가
              // 인라인 transform으로 직접 잡으므로 우리가 translate로 관여하지 않는다.
              "data-swiping:duration-0",
              // 놓을 때는 스와이프 속도에 비례해 미끄러진다.
              "data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)]",
              className,
            )}
          >
            <div aria-hidden="true" className="flex shrink-0 justify-center pt-ds-8 pb-ds-4">
              <div className="h-1 w-10 rounded-ds-full bg-stroke-primary" />
            </div>

            <div className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-ds-8 px-ds-20 py-ds-12">
              <div className="flex items-center justify-start gap-ds-8">{left}</div>
              <Drawer.Title
                className={cn(
                  "min-w-0 truncate text-center text-heading-sm text-content-primary",
                  !titleVisible && "sr-only",
                )}
              >
                {title}
              </Drawer.Title>
              <div className="flex items-center justify-end gap-ds-8">{right}</div>
            </div>

            <div
              className={cn(
                // min-h-0이 없으면 flex 자식의 기본 min-height:auto 때문에 본문이 줄지 않고
                // 시트가 max-h를 넘긴다.
                "flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-ds-20",
                !footer && "pb-ds-20",
              )}
            >
              {children}
            </div>

            {footer ? <div className="shrink-0 px-ds-20 pt-ds-20 pb-ds-20">{footer}</div> : null}
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
