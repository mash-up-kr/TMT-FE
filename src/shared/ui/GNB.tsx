import type { ReactNode } from "react";
import { TMTLogo } from "@/shared/ui/icons";
import { cn } from "@/shared/utils/cn";

type GNBProps = Readonly<{
  /** 좌측 슬롯. */
  left?: ReactNode;
  /** 우측 슬롯. */
  right?: ReactNode;
  /** 없으면 로고가 대신 들어간다. */
  title?: string;
  /** 타이틀·로고의 가로 위치. 기본은 중앙. */
  align?: "center" | "left";
  className?: string;
}>;

/**
 * 상단 네비게이션 바.
 *
 * 슬롯은 항상 좌·중앙·우 세 칸이고 정렬은 트랙 정의로만 가른다. 계층을 align에 따라 바꾸면
 * 슬롯 간격과 축소 계약이 분기마다 달라져 같은 종류의 누락이 반복된다.
 */
export function GNB({ left, right, title, align = "center", className }: GNBProps) {
  const heading = title ? (
    <p className="truncate text-heading-sm text-content-primary">{title}</p>
  ) : (
    <TMTLogo />
  );

  return (
    <header
      className={cn(
        "grid w-full items-center gap-ds-8 bg-surface-primary px-ds-20 py-ds-12",
        align === "center" ? "grid-cols-[1fr_auto_1fr]" : "grid-cols-[auto_auto_1fr]",
        className,
      )}
    >
      <div className="flex items-center justify-start gap-ds-8">{left}</div>
      <div className="flex min-w-0 items-center justify-center">{heading}</div>
      <div className="flex items-center justify-end gap-ds-8">{right}</div>
    </header>
  );
}
