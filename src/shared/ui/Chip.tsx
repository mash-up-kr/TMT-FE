import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

type ChipSize = "sm" | "md" | "lg";

const sizeStyles: Record<ChipSize, string> = {
  sm: "py-ds-4 text-body-sm-medium [&_svg]:size-ds-16",
  md: "py-ds-4 text-body-md-medium [&_svg]:size-ds-16",
  lg: "py-ds-8 text-body-md-medium [&_svg]:size-ds-20",
};

const unselectedStyles =
  "inset-ring-stroke-primary bg-surface-primary text-content-primary " +
  "hover:inset-ring-stroke-interactive-secondary hover:bg-surface-interactive-tertiary hover:text-content-secondary " +
  "active:inset-ring-stroke-interactive-secondary-hovered active:bg-surface-interactive-tertiary-hovered active:text-content-tertiary";

const selectedStyles =
  "inset-ring-stroke-interactive-primary bg-surface-selected text-content-interactive-primary " +
  "hover:inset-ring-stroke-interactive-primary-hovered hover:bg-surface-selected-hovered hover:text-content-interactive-primary-hovered " +
  "active:inset-ring-stroke-interactive-primary-pressed active:bg-surface-selected-pressed active:text-content-interactive-primary-pressed";

type ChipProps = ComponentProps<"button"> & {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  selected?: boolean;
  size?: ChipSize;
};

function Chip({
  children,
  className,
  leftIcon,
  rightIcon,
  selected,
  size = "md",
  type = "button",
  ...props
}: ChipProps) {
  return (
    <button
      data-slot="chip"
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-ds-4 whitespace-nowrap rounded-ds-full inset-ring px-ds-12 outline-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-interactive-primary",
        "disabled:pointer-events-none disabled:inset-ring-stroke-disabled disabled:bg-surface-disabled disabled:text-content-disabled",
        "[&_svg]:shrink-0",
        sizeStyles[size],
        selected ? selectedStyles : unselectedStyles,
        className,
      )}
      type={type}
      {...props}
      aria-pressed={selected}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}

export { Chip };
