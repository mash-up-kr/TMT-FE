import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export type ScreenLayoutProps = ComponentPropsWithoutRef<"div"> & {
  header: ReactNode;
  /** 본문이 별도의 스크롤 영역을 가질 때 false. */
  bodyScrollable?: boolean;
  /** 스크롤과 무관하게 본문 위에 떠 있는 요소(FAB 등). 본문 영역을 기준으로 배치된다. */
  floating?: ReactNode;
};

export function ScreenLayout({
  header,
  children,
  className,
  bodyScrollable = true,
  floating,
  ...props
}: ScreenLayoutProps) {
  const body = (
    <div className={cn("flex min-h-0 flex-1 flex-col", bodyScrollable && "overflow-y-auto")}>
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
          {floating}
        </div>
      )}
    </div>
  );
}
