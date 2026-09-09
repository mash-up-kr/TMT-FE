"use client";

import type { ComponentPropsWithoutRef, ReactNode, Ref } from "react";
import { PULL_THRESHOLD_PX, usePullToRefresh } from "@/shared/hooks/usePullToRefresh";
import { Spinner } from "@/shared/ui/Spinner";
import { cn } from "@/shared/utils/cn";

export type ScreenLayoutProps = ComponentPropsWithoutRef<"div"> & {
  header: ReactNode;
  /** 본문이 별도의 스크롤 영역을 가질 때 false. 자식은 inset을 적용한 자체 스크롤 또는 full-bleed 표면을 명시한다. */
  bodyScrollable?: boolean;
  /** false면 본문이 내비게이션 뒤까지 채워지며, 각 콘텐츠가 마지막 항목의 하단 여백을 소유한다. */
  bodyBottomInset?: boolean;
  /** 본문 스크롤 위치를 제어할 때 사용한다. */
  bodyRef?: Ref<HTMLDivElement>;
  /** 스크롤과 무관하게 본문 위에 떠 있는 요소(FAB 등). 바텀 내브를 제외한 본문 영역을 기준으로 배치된다. */
  floating?: ReactNode;
  /** 본문을 맨 위에서 당겨 놓으면 호출한다. resolve될 때까지 인디케이터를 유지한다. 본문이 스크롤될 때만 동작한다. */
  onRefresh?: () => Promise<unknown>;
};

const REFRESH_LABEL = {
  idle: "",
  pulling: "당겨서 새로고침",
  ready: "놓으면 새로고침",
  refreshing: "새로고침 중",
} as const;

export function ScreenLayout({
  header,
  children,
  className,
  bodyScrollable = true,
  bodyBottomInset = true,
  bodyRef,
  floating,
  onRefresh,
  ...props
}: ScreenLayoutProps) {
  const body =
    bodyScrollable && onRefresh ? (
      <RefreshableBody onRefresh={onRefresh} bottomInset={bodyBottomInset} bodyRef={bodyRef}>
        {children}
      </RefreshableBody>
    ) : (
      <div
        ref={bodyRef}
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          bodyScrollable && "overflow-y-auto",
          bodyScrollable && bodyBottomInset && "scroll-under-navigation",
        )}
      >
        {children}
      </div>
    );

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)} {...props}>
      {header}
      {/* floating이 없으면 감싸지 않는다. relative를 늘 두면 기존 화면의 쌓임 맥락이 바뀐다. */}
      {floating == null ? (
        body
      ) : (
        <div className="relative flex min-h-0 flex-1 flex-col">
          {body}
          {/* 바텀 내브가 오버레이라 이 레이어의 바닥을 알약 위로 올린다. 그래야 FAB이 내브 높이를
              모른 채 `bottom-ds-20`만으로 알약 위에 놓인다. 레이어 자체는 이벤트를 먹지 않는다. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 bottom-(--layout-bottom-inset)">
            {floating}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 인디케이터를 본문 뒤에 두고, 당긴 만큼 본문을 내려 드러낸다.
 * 손을 떼면 본문이 되돌아오는 전환만 걸고, 당기는 동안은 손가락을 바로 따라간다.
 */
function RefreshableBody({
  onRefresh,
  bottomInset,
  bodyRef,
  children,
}: {
  onRefresh: () => Promise<unknown>;
  bottomInset: boolean;
  bodyRef?: Ref<HTMLDivElement>;
  children: ReactNode;
}) {
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
        {...handlers}
        ref={bodyRef}
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-none",
          bottomInset && "scroll-under-navigation",
          !isTracking &&
            "transition-[translate] duration-200 ease-out motion-reduce:transition-none",
        )}
        style={{ translate: `0 ${pullDistance}px` }}
      >
        {children}
      </div>
    </div>
  );
}
