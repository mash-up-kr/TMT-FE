import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

type BadgeTone = "brand" | "neutral";

const toneStyles = {
  brand: "bg-surface-selected px-ds-12 text-content-interactive-primary",
  neutral: "bg-surface-tertiary px-ds-8 text-content-secondary",
} satisfies Record<BadgeTone, string>;

type BadgeProps = Readonly<{
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}>;

/**
 * 누를 수 없는 정적 라벨. `Chip`이 색은 같지만 `<button>`이라 접근성 트리에 동작 없는
 * 버튼이 노출되므로 쓰지 않는다.
 */
export function Badge({ tone = "brand", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-ds-full text-body-sm-medium",
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
