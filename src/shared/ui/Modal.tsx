"use client";

import { Dialog } from "@base-ui/react/dialog";
import type { ReactNode } from "react";
import { CancelIcon } from "@/shared/ui/icons";
import { cn } from "@/shared/utils/cn";

type ModalProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** 제목을 화면에도 노출한다. 기본은 숨김. */
  titleVisible?: boolean;
  description?: string;
  /** 본문. 아이콘·입력 등 내용 구조는 전부 호출부가 조립한다. */
  children?: ReactNode;
  /** CTA 영역. 스크롤 밖 하단에 고정된다. 버튼 배치는 호출부가 정한다. */
  footer?: ReactNode;
  showClose?: boolean;
  className?: string;
}>;

export function Modal({
  open,
  onOpenChange,
  title,
  titleVisible = false,
  description,
  children,
  footer,
  showClose = true,
  className,
}: ModalProps) {
  /**
     title은 기본적으로 design-system 내부에서 사용되지 않음.
     그래서 titleVisible은 기본적으로 보이지 않게 해둠.
     남겨둔 이유는 오롯이 스크린리더 대응을 위함. (헤더를 렌더하지 않아도 이름은 있어야 한다 — 없으면 스크린리더가 "대화상자"라고만 읽는다.)
   */
  const hasHeader = showClose || titleVisible;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-surface-backdrop" />
        <Dialog.Viewport className="overlay-viewport">
          <Dialog.Popup
            className={cn(
              "flex max-h-full w-full flex-col overflow-hidden rounded-ds-xl bg-surface-primary shadow-modal",
              className,
            )}
          >
            {hasHeader ? (
              <div className="flex shrink-0 items-start justify-end gap-ds-8 px-ds-20 pt-ds-20 pb-ds-8">
                <Dialog.Title
                  className={cn(
                    "min-w-0 flex-1 text-heading-sm text-content-primary",
                    !titleVisible && "sr-only",
                  )}
                >
                  {title}
                </Dialog.Title>
                {showClose ? (
                  <Dialog.Close aria-label="닫기" className="shrink-0 text-icon-primary">
                    <CancelIcon thick />
                  </Dialog.Close>
                ) : null}
              </div>
            ) : null}
            <div
              className={cn(
                "flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-ds-20",
                !hasHeader && "pt-ds-20",
                !footer && "pb-ds-20",
              )}
            >
              {hasHeader ? null : <Dialog.Title className="sr-only">{title}</Dialog.Title>}
              {description ? (
                <Dialog.Description className="text-body-lg-regular text-content-secondary">
                  {description}
                </Dialog.Description>
              ) : null}
              {children}
              {showClose ? null : (
                <Dialog.Close aria-label="닫기" className="sr-only">
                  닫기
                </Dialog.Close>
              )}
            </div>
            {footer ? <div className="shrink-0 px-ds-20 pt-ds-20 pb-ds-20">{footer}</div> : null}
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
