"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import type { ComponentProps } from "react";
import { cn } from "@/shared/utils/cn";

type ProgressProps = Omit<
  ComponentProps<typeof ProgressPrimitive.Root>,
  "children" | "className"
> & {
  className?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function Progress({ className, max = 100, min = 0, value, ...props }: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn("w-full", className)}
      max={max}
      min={min}
      value={value === null ? null : clamp(value, min, max)}
      {...props}
    >
      <ProgressPrimitive.Track
        data-slot="progress-track"
        className="h-ds-4 w-full rounded-ds-full bg-surface-tertiary"
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="h-full rounded-ds-full bg-surface-brand transition-[width] data-indeterminate:w-0 motion-reduce:transition-none"
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  );
}

export type { ProgressProps };
export { Progress };
