import SparkleIcon from "./assets/sparkle.svg?react";

type MatchedStoreBadgeProps = {
  count: number;
};

/** 저장한 가게와 겹치는 정도를 알리는 강조 뱃지. */
export function MatchedStoreBadge({ count }: MatchedStoreBadgeProps) {
  if (count <= 0) {
    return null;
  }

  return (
    <p className="flex w-fit items-center gap-ds-2 rounded-ds-xs bg-surface-groupcard-badge px-ds-4 py-ds-2 text-body-sm-medium text-content-interactive-primary">
      내가 저장한 가게와 {count}개 일치해요
      <SparkleIcon aria-hidden="true" width={12} height={12} className="shrink-0" />
    </p>
  );
}
