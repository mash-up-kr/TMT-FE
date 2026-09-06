import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/shared/utils/cn";

export function Skeleton({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-ds-md bg-surface-secondary", className)}
      {...props}
    />
  );
}
