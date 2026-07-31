"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";
import { type CSSProperties, useLayoutEffect, useRef } from "react";
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
 * 여러 장은 서로 포개진 채 뒤로 갈수록 위로 밀린다. 자리는 Base UI가 내려주는
 * `--toast-offset-y`(앞 토스트들의 실측 높이 합)에 간격만 더해 CSS로 잡는다.
 */
export function ToastItem({ toast }: ToastProps) {
  const Icon = ICONS[toast.data.type];
  const rootRef = useRef<HTMLDivElement>(null);
  const exitY = useRef<string>("0px");
  const isEnding = toast.transitionStatus === "ending";

  /**
   * 퇴장이 시작되면 Base UI가 `--toast-offset-y`를 0으로 되돌린다. 쌓여 있던 카드는
   * 그만큼 아래로 몰리므로, 살아 있는 동안의 자리를 붙잡아 퇴장 중에는 그 값을 쓴다.
   * sonner도 같은 이유로 사라지기 직전 offset을 저장한다.
   */
  useLayoutEffect(() => {
    if (isEnding || !rootRef.current) {
      return;
    }
    exitY.current = getComputedStyle(rootRef.current).getPropertyValue("--stack-y").trim();
  });

  return (
    <BaseToast.Root
      ref={rootRef}
      toast={toast}
      swipeDirection={[]}
      style={isEnding ? ({ "--stack-y": exitY.current } as CSSProperties) : undefined}
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
        "z-[calc(var(--toast-index)*-1)]",
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
