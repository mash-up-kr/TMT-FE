import type { ComponentPropsWithRef } from "react";
import { cn } from "@/shared/utils/cn";

type BadgeTone = "brand" | "neutral";
type BadgeSize = "sm" | "md";

const toneStyles = {
  brand: "bg-surface-selected text-content-interactive-primary",
  neutral: "bg-surface-tertiary text-content-secondary",
} satisfies Record<BadgeTone, string>;

// 시안은 세로 padding 없이 프레임 높이로 여백을 준다. md는 20(줄높이 18 + 위아래 1),
// sm은 줄높이 그대로다.
const sizeStyles = {
  sm: "px-ds-8",
  md: "h-ds-20 px-ds-12",
} satisfies Record<BadgeSize, string>;

export type BadgeProps = ComponentPropsWithRef<"span"> & {
  tone?: BadgeTone;
  size?: BadgeSize;
};

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
