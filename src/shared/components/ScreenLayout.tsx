import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export type ScreenLayoutProps = ComponentPropsWithoutRef<"div"> & {
  header: ReactNode;
  /** 본문이 별도의 스크롤 영역을 가질 때 false. */
  bodyScrollable?: boolean;
};

export function ScreenLayout({
  header,
  children,
  className,
  bodyScrollable = true,
  ...props
}: ScreenLayoutProps) {
  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)} {...props}>
      {header}
      <div className={cn("flex min-h-0 flex-1 flex-col", bodyScrollable && "overflow-y-auto")}>
        {children}
      </div>
    </div>
  );
}
