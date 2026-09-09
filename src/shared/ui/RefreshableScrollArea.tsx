"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import type { ComponentPropsWithRef } from "react";
import { PULL_THRESHOLD_PX, usePullToRefresh } from "@/shared/hooks/usePullToRefresh";
import { Spinner } from "@/shared/ui/Spinner";
import { cn } from "@/shared/utils/cn";

type RefreshableScrollAreaProps = ComponentPropsWithRef<"div"> & {
  onRefresh: () => Promise<unknown>;
};

const REFRESH_LABEL = {
  idle: "",
  pulling: "당겨서 새로고침",
  ready: "놓으면 새로고침",
  refreshing: "새로고침 중",
} as const;

/**
 * 인디케이터를 본문 뒤에 두고, 당긴 만큼 본문을 내려 드러낸다.
 * 손을 떼면 본문이 되돌아오는 전환만 걸고, 당기는 동안은 손가락을 바로 따라간다.
 */
export function RefreshableScrollArea({
  onRefresh,
  ref,
  children,
  className,
  style,
  ...props
}: RefreshableScrollAreaProps) {
  const { status, pullDistance, handlers } = usePullToRefresh<HTMLDivElement>({ onRefresh });
  const isTracking = status === "pulling" || status === "ready";

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <output
        aria-live="polite"
        className="absolute inset-x-0 top-0 flex items-center justify-center"
        style={{
          height: PULL_THRESHOLD_PX,
          opacity: Math.min(pullDistance / PULL_THRESHOLD_PX, 1),
        }}
      >
        <Spinner size="md" />
        <span className="sr-only">{REFRESH_LABEL[status]}</span>
      </output>
      <div
        {...mergeProps<"div">(handlers, props)}
        ref={ref}
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-none",
          !isTracking &&
            "transition-[translate] duration-200 ease-out motion-reduce:transition-none",
          className,
        )}
        style={{ ...style, translate: `0 ${pullDistance}px` }}
      >
        {children}
      </div>
    </div>
  );
}
