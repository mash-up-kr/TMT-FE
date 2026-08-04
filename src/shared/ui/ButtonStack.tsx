import type { ComponentPropsWithRef } from "react";
import { cn } from "@/shared/utils/cn";

type ButtonStackType = "vertical" | "horizontal";

export type ButtonStackProps = ComponentPropsWithRef<"div"> & {
  type?: ButtonStackType;
};

const typeStyles = {
  vertical: "flex-col gap-ds-12 [&>*]:w-full",
  horizontal: "items-center gap-ds-8 [&>*]:min-w-0 [&>*]:flex-1",
} satisfies Record<ButtonStackType, string>;

export function ButtonStack({ type = "vertical", className, ...props }: ButtonStackProps) {
  return <div className={cn("flex w-full", typeStyles[type], className)} {...props} />;
}
