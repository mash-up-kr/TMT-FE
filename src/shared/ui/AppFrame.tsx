import type { ComponentPropsWithRef } from "react";
import { cn } from "@/shared/utils/cn";

type AppFrameProps = ComponentPropsWithRef<"div">;

export function AppFrame({ children, className, ...props }: AppFrameProps) {
  return (
    <div className={cn("app-frame", className)} {...props}>
      {children}
    </div>
  );
}
