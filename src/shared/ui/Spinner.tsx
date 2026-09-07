import type { ComponentPropsWithoutRef, CSSProperties } from "react";
import { cn } from "@/shared/utils/cn";

type SpinnerSize = "sm" | "md" | "lg";
type SpinnerTone = "brand" | "current";

export type SpinnerProps = ComponentPropsWithoutRef<"span"> & {
  size?: SpinnerSize;
  tone?: SpinnerTone;
};

const rotations = [
  "rotate-0",
  "-rotate-45",
  "-rotate-90",
  "-rotate-135",
  "rotate-180",
  "rotate-135",
  "rotate-90",
  "rotate-45",
] as const;

const sizeStyles = {
  sm: "size-ds-20",
  md: "size-ds-24",
  lg: "size-ds-48",
} satisfies Record<SpinnerSize, string>;

const toneStyles = {
  brand: { active: "bg-spinner-active", inactive: "bg-spinner-inactive" },
  current: { active: "bg-current", inactive: "bg-current opacity-30" },
} satisfies Record<SpinnerTone, { active: string; inactive: string }>;

export function Spinner({ size = "md", tone = "brand", className, ...props }: SpinnerProps) {
  const colors = toneStyles[tone];

  return (
    <span
      aria-hidden="true"
      className={cn("relative inline-block shrink-0", sizeStyles[size], className)}
      {...props}
    >
      {rotations.map((rotation, index) => (
        <span className={cn("absolute inset-0", rotation)} key={rotation}>
          <span
            className={cn(
              "absolute left-1/2 top-0 h-1/4 w-1/12 -translate-x-1/2 rounded-ds-full",
              colors.inactive,
            )}
          />
          <span
            className={cn(
              "spinner-segment-active absolute left-1/2 top-0 h-1/4 w-1/12 -translate-x-1/2 rounded-ds-full",
              index === 0 && "spinner-segment-initial-active",
              colors.active,
            )}
            style={{ animationDelay: `${-index * 100}ms` } satisfies CSSProperties}
          />
        </span>
      ))}
    </span>
  );
}
