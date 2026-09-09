"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { RefreshableScrollArea } from "@/shared/ui/RefreshableScrollArea";
import { cn } from "@/shared/utils/cn";

export type ScreenLayoutProps = ComponentPropsWithoutRef<"div"> & {
  header: ReactNode;
  /** 본문이 별도의 스크롤 영역을 가질 때 false. 자식은 inset을 적용한 자체 스크롤 또는 full-bleed 표면을 명시한다. */
  bodyScrollable?: boolean;
  /** 스크롤과 무관하게 본문 위에 떠 있는 요소(FAB 등). 바텀 내브를 제외한 본문 영역을 기준으로 배치된다. */
  floating?: ReactNode;
  /** 본문을 맨 위에서 당겨 놓으면 호출한다. resolve될 때까지 인디케이터를 유지한다. 본문이 스크롤될 때만 동작한다. */
  onRefresh?: () => Promise<unknown>;
};

export function ScreenLayout({
  header,
  children,
  className,
  bodyScrollable = true,
  floating,
  onRefresh,
  ...props
}: ScreenLayoutProps) {
  const body =
    bodyScrollable && onRefresh ? (
      <RefreshableScrollArea onRefresh={onRefresh} className="scroll-under-navigation">
        {children}
      </RefreshableScrollArea>
    ) : (
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          bodyScrollable && "overflow-y-auto scroll-under-navigation",
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
