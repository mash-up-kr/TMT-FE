import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";
import { LoadingIcon } from "./icons";

type ButtonVariant = "primary" | "secondary" | "tertiary";
type ButtonSize = "lg" | "md" | "sm";

export type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const baseStyles =
  "inline-flex items-center justify-center gap-ds-8 rounded-ds-md [&_svg]:shrink-0";

const disabledStyles =
  "disabled:pointer-events-none disabled:bg-surface-disabled disabled:text-content-disabled";

const variantStyles = {
  primary:
    "bg-surface-interactive-primary text-content-interactive-inverse hover:bg-surface-interactive-primary-hovered active:bg-surface-interactive-primary-pressed",
  secondary:
    "bg-surface-interactive-secondary text-content-interactive-inverse hover:bg-surface-interactive-secondary-hovered active:bg-surface-interactive-secondary-pressed",
  tertiary:
    "bg-surface-interactive-tertiary text-content-secondary hover:bg-surface-interactive-tertiary-hovered hover:text-content-tertiary active:bg-surface-interactive-tertiary-pressed active:text-content-tertiary",
} satisfies Record<ButtonVariant, string>;

const sizeStyles = {
  lg: "px-ds-24 py-ds-12 text-body-lg-bold [&_svg]:size-ds-24",
  md: "px-ds-16 py-ds-12 text-body-md-bold [&_svg]:size-ds-20",
  sm: "px-ds-16 py-ds-8 text-body-md-medium [&_svg]:size-ds-20",
} satisfies Record<ButtonSize, string>;

export function Button({
  variant = "primary",
  size = "lg",
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        loading ? "pointer-events-none" : disabledStyles,
        className,
      )}
      {...props}
    >
      {loading ? <LoadingIcon /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
