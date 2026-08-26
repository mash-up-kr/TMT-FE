import type { ComponentProps } from "react";
import { cn } from "@/shared/utils/cn";
import SparkleIcon from "./assets/sparkle.svg?react";

/** 시안이 12px 고정이라 ds 스케일 대신 값으로 둔다. */
const ICON_SIZE = 12;

type MatchedPlaceBadgeProps = ComponentProps<"p"> & {
  /** 문구는 화면마다 세는 단위가 달라 호출부가 소유한다. */
  children: string;
};

/** 저장한 가게와 겹치는 정도를 알리는 강조 뱃지. */
export function MatchedPlaceBadge({ children, className, ...props }: MatchedPlaceBadgeProps) {
  return (
    <p
      className={cn(
        "flex w-fit items-center gap-ds-2 rounded-ds-xs bg-surface-groupcard-badge px-ds-4 py-ds-2 text-body-sm-medium text-content-interactive-primary",
        className,
      )}
      {...props}
    >
      {children}
      <SparkleIcon aria-hidden="true" width={ICON_SIZE} height={ICON_SIZE} className="shrink-0" />
    </p>
  );
}
