"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import type { ComponentProps } from "react";
import { cn } from "@/shared/utils/cn";

type ProgressProps = Omit<ComponentProps<typeof ProgressPrimitive.Root>, "className"> & {
  className?: string;
};

function Progress({ className, ...props }: ProgressProps) {
  return (
    <ProgressPrimitive.Root data-slot="progress" className={cn("w-full", className)} {...props}>
      <ProgressPrimitive.Track
        data-slot="progress-track"
        className="h-ds-4 w-full overflow-hidden rounded-ds-full bg-surface-tertiary"
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="h-full w-0 rounded-ds-full bg-surface-brand transition-[width] motion-reduce:transition-none data-indeterminate:w-1/3 data-indeterminate:animate-pulse"
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  );
}

export type { ProgressProps };
export { Progress };
