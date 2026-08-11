import type { FieldSize } from "@/shared/ui/FieldFrame";
import { cn } from "@/shared/utils/cn";

/** 트리거 우측 chevron 크기 */
export const iconSize: Record<FieldSize, number> = {
  lg: 24,
  md: 20,
};

/** 항목 라벨 아래 보조 설명 타이포 */
export const descriptionText: Record<FieldSize, string> = {
  lg: "text-body-md-medium",
  md: "text-body-sm-medium",
};

// 팝업 높이 계산용 — 각각 fieldText·descriptionText의 line-height와 값을 맞춘다
const labelLineHeight: Record<FieldSize, string> = {
  lg: "var(--text-body-lg-medium--line-height)",
  md: "var(--text-body-md-medium--line-height)",
};

const descriptionLineHeight: Record<FieldSize, string> = {
  lg: "var(--text-body-md-medium--line-height)",
  md: "var(--text-body-sm-medium--line-height)",
};

/** 보이는 항목 수만큼의 팝업 높이. 이보다 항목이 많으면 스크롤한다. */
export function listMaxHeight(
  size: FieldSize,
  hasDescription: boolean,
  visibleItems: number,
): string {
  const item = [
    "var(--spacing-ds-16)",
    labelLineHeight[size],
    ...(hasDescription ? ["var(--spacing-ds-4)", descriptionLineHeight[size]] : []),
  ].join(" + ");

  return `calc((${item}) * ${visibleItems} + var(--spacing-ds-16))`;
}

export const popupSurface = cn(
  "w-(--anchor-width) origin-(--transform-origin) rounded-ds-md bg-surface-primary shadow-floating outline-none",
  "transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none",
  "data-starting-style:scale-98 data-starting-style:opacity-0",
  "data-ending-style:scale-98 data-ending-style:opacity-0",
);

/** `--select-thumb-radius` 값. listScroll의 스크롤바 thumb이 참조한다. */
export const SCROLL_THUMB_RADIUS = "2px 6px 6px 2px / 2px";

export const listScroll = cn(
  "max-h-[min(var(--available-height),var(--select-list-max-height))]",
  "overflow-y-auto overscroll-contain py-ds-8",
  "[&::-webkit-scrollbar]:w-ds-8",
  "[&::-webkit-scrollbar-track]:my-ds-8 [&::-webkit-scrollbar-track]:bg-transparent",
  "[&::-webkit-scrollbar-thumb]:bg-icon-secondary",
  "[&::-webkit-scrollbar-thumb]:border-r-4 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-clip-padding",
  "[&::-webkit-scrollbar-thumb]:[border-radius:var(--select-thumb-radius)]",
  "[&::-webkit-scrollbar-thumb]:min-h-[120px]",
);

export const itemBackground = cn(
  "bg-surface-primary",
  "not-data-disabled:data-highlighted:bg-surface-secondary",
  "not-data-disabled:active:bg-surface-interactive-tertiary-hovered",
  "not-data-disabled:data-highlighted:active:bg-surface-interactive-tertiary-hovered",
  "data-selected:not-data-disabled:bg-surface-selected",
  "data-selected:not-data-disabled:data-highlighted:bg-surface-selected-hovered",
  "data-selected:not-data-disabled:active:bg-surface-selected-pressed",
  "data-selected:not-data-disabled:data-highlighted:active:bg-surface-selected-pressed",
  "data-disabled:pointer-events-none data-disabled:bg-surface-disabled",
);

export const itemLayout =
  "group/item flex select-none items-center gap-ds-8 px-ds-16 py-ds-8 outline-none";
