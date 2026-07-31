"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";
import { cn } from "@/shared/utils/cn";
import ErrorIcon from "./assets/error.svg?react";
import SuccessIcon from "./assets/success.svg?react";
import WarningIcon from "./assets/warning.svg?react";
import type { ToastType, TypedToast } from "./toast";

const ICONS: Record<ToastType, typeof SuccessIcon> = {
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

/** 좌상단에서 타입 색이 은은하게 번지는 빛. 시안은 212px 원의 radial gradient다. */
const GLOWS: Record<ToastType, string> = {
  success: "before:bg-[radial-gradient(circle,var(--color-icon-success)_0%,transparent_70%)]",
  warning: "before:bg-[radial-gradient(circle,var(--color-icon-warning)_0%,transparent_70%)]",
  error: "before:bg-[radial-gradient(circle,var(--color-icon-error)_0%,transparent_70%)]",
};

type ToastProps = Readonly<{
  toast: TypedToast;
}>;

/**
 * 토스트 한 장. `Toaster`가 목록을 돌며 렌더한다.
 *
 * 여러 장이 쌓이면 카드 덱처럼 겹친다 — 뒤쪽은 위로 밀리고 작아지며 내용이 가려진다.
 * 위치 계산은 Base UI가 내려주는 `--toast-index`로 CSS에서 끝내 JS 측정이 필요 없다.
 */
export function ToastItem({ toast }: ToastProps) {
  const Icon = ICONS[toast.data.type];

  return (
    <BaseToast.Root
      toast={toast}
      swipeDirection={[]}
      className={cn(
        "absolute inset-x-(--layout-floating-inset-inline) bottom-[calc(var(--layout-floating-inset-block)+env(safe-area-inset-bottom))]",
        "pointer-events-auto flex items-center gap-ds-8",
        // 쌓인 위치와 등장·퇴장 이동을 분리해 서로 덮지 않게 한다.
        "[--stack-y:calc((var(--toast-offset-y)+var(--toast-index)*var(--spacing-ds-8))*-1)] [--slide-y:0px]",
        "overflow-hidden rounded-ds-sm bg-surface-inverse px-ds-16 py-ds-12 shadow-toast",
        // 좌상단에서 타입 색이 번지는 빛. 카드 밖으로는 overflow-hidden이 잘라낸다.
        "before:absolute before:-top-[65px] before:-left-[74px] before:size-[212px] before:rounded-full before:opacity-[0.12] before:content-['']",
        GLOWS[toast.data.type],
        "transition-[transform,opacity] duration-300 ease-out",
        // 뒤 토스트는 앞 토스트들의 실제 높이(--toast-offset-y)만큼 위로 올라가 서로 겹치지 않는다.
        "translate-y-[calc(var(--stack-y)+var(--slide-y))]",
        "z-[calc(9-var(--toast-index))]",
        // 등장만 아래에서 올라오고, 퇴장은 제자리에서 사라진다.
        "data-[starting-style]:[--slide-y:100%] data-[starting-style]:opacity-0",
        // 퇴장은 제자리에서 서서히 사라진다.
        "data-[ending-style]:opacity-0",
        "data-[limited]:pointer-events-none data-[limited]:opacity-0",
      )}
    >
      <Icon aria-hidden="true" width={24} height={24} className="relative shrink-0" />
      <div className="relative flex min-w-0 flex-1 flex-col gap-ds-2 text-content-interactive-inverse">
        <BaseToast.Title className="text-body-lg-medium" />
        {toast.description ? <BaseToast.Description className="text-body-md-regular" /> : null}
      </div>
    </BaseToast.Root>
  );
}
