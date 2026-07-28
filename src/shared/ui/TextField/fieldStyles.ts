import { cn } from "@/shared/utils/cn";

export type FieldSize = "md" | "lg";
export type HelpTone = "default" | "success";
export type ResolvedHelpTone = HelpTone | "error";

export const containerGap: Record<FieldSize, string> = {
  lg: "gap-ds-12",
  md: "gap-ds-8",
};

/** 라벨 · 입력 텍스트 타이포 (Figma: 모두 Medium) */
export const fieldText: Record<FieldSize, string> = {
  lg: "text-body-lg-medium",
  md: "text-body-md-medium",
};

/** 헬프 메시지 타이포. 라벨·입력과 무관하게 항상 14px. */
export const helpText: Record<FieldSize, string> = {
  lg: "text-body-md-medium",
  md: "text-body-md-medium",
};

export const fieldBoxBase =
  "flex w-full gap-ds-12 overflow-hidden rounded-ds-md border-sm px-ds-16 py-ds-12 transition-colors";

/**
 * 박스 상태별 배경/테두리.
 * 우선순위: disabled > invalid > interactive(hover/focus).
 * interactive 브랜치에서만 hover/focus 변형을 노출해 클래스 충돌을 피한다.
 */
export function fieldBoxState(disabled: boolean, invalid: boolean): string {
  if (disabled) {
    return "bg-surface-disabled border-stroke-disabled cursor-not-allowed";
  }
  if (invalid) {
    return "bg-surface-primary border-stroke-error";
  }

  return cn(
    "bg-surface-primary border-stroke-field",
    "hover:border-stroke-field-hovered focus-within:border-stroke-field-pressed",
  );
}

/** 네이티브 input/textarea 공통 스타일 (박스가 테두리·배경 담당, 컨트롤은 투명) */
export function controlClass(size: FieldSize): string {
  return cn(
    "min-w-0 flex-1 border-0 bg-transparent p-0 text-content-primary outline-none",
    "placeholder:text-content-tertiary placeholder:opacity-70",
    "disabled:cursor-not-allowed disabled:text-content-disabled disabled:placeholder:text-content-disabled",
    fieldText[size],
  );
}

export const helpToneColor: Record<ResolvedHelpTone, string> = {
  default: "text-content-tertiary",
  error: "text-content-error",
  success: "text-content-success",
};
