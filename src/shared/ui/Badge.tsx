import type { ComponentPropsWithRef } from "react";
import { cn } from "@/shared/utils/cn";

type BadgeTone = "brand" | "neutral" | "neutral-weak";
type BadgeSize = "xs" | "sm" | "md";
type BadgeShape = "pill" | "square";

const toneStyles = {
  brand: "bg-surface-selected text-content-interactive-primary",
  neutral: "bg-surface-tertiary text-content-secondary",
  "neutral-weak": "bg-surface-secondary text-content-secondary",
} satisfies Record<BadgeTone, string>;

const sizeStyles = {
  xs: "h-ds-20 px-ds-4",
  sm: "px-ds-8",
  md: "h-ds-20 px-ds-12",
} satisfies Record<BadgeSize, string>;

const shapeStyles = {
  pill: "rounded-ds-full",
  square: "rounded-ds-xs",
} satisfies Record<BadgeShape, string>;

export type BadgeProps = ComponentPropsWithRef<"span"> & {
  tone?: BadgeTone;
  size?: BadgeSize;
  shape?: BadgeShape;
};

export function Badge({
  tone = "brand",
  size = "sm",
  shape = "pill",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-ds-4 whitespace-nowrap text-body-sm-medium",
        toneStyles[tone],
        sizeStyles[size],
        shapeStyles[shape],
        className,
      )}
      {...props}
    />
  );
}
