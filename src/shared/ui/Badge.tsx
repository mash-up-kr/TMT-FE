import type { ComponentPropsWithRef } from "react";
import { cn } from "@/shared/utils/cn";

type BadgeTone = "brand" | "neutral";
type BadgeSize = "sm" | "md";

const toneStyles = {
  brand: "bg-surface-selected text-content-interactive-primary",
  neutral: "bg-surface-tertiary text-content-secondary",
} satisfies Record<BadgeTone, string>;

const sizeStyles = {
  sm: "px-ds-8",
  md: "px-ds-12",
} satisfies Record<BadgeSize, string>;

export type BadgeProps = ComponentPropsWithRef<"span"> & {
  tone?: BadgeTone;
  size?: BadgeSize;
};

/**
 * 누를 수 없는 정적 라벨.
 *
 * `Chip`과 형태가 닮았지만 `Chip`은 `<button>`이라 그대로 쓰면 동작 없는 버튼이
 * 접근성 트리에 노출된다. 상태·사이즈 스케일도 서로 달라 기반을 공유하지 않는다.
 */
export function Badge({ tone = "brand", size = "sm", className, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-ds-4 whitespace-nowrap rounded-ds-full text-body-sm-medium",
        toneStyles[tone],
        sizeStyles[size],
        className,
      )}
      {...props}
    />
  );
}
