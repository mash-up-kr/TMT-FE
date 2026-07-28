import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";
import {
  containerGap,
  type FieldSize,
  fieldBoxBase,
  fieldBoxState,
  fieldText,
  type HelpTone,
  helpText,
  helpToneColor,
  type ResolvedHelpTone,
} from "./fieldStyles";

export type FieldFrameProps = Readonly<{
  /** input/textarea id — label의 htmlFor로 연결 */
  htmlFor?: string;
  size?: FieldSize;
  label?: ReactNode;
  required?: boolean;
  optional?: boolean;
  /** 라벨 우측 영역 (예: 글자 수 카운터) */
  labelAside?: ReactNode;
  helpMessage?: ReactNode;
  helpMessageId?: string;
  /** 헬프 메시지 톤. 오류 톤은 `invalid`에서 파생되므로 여기서 지정하지 않는다. */
  helpTone?: HelpTone;
  invalid?: boolean;
  disabled?: boolean;
  /** 박스 내부 컨트롤 정렬 (textarea는 start) */
  controlAlign?: "center" | "start";
  containerClassName?: string;
  children: ReactNode;
}>;

/**
 * TextField·Textarea가 공유하는 필드 공통 레이아웃.
 * 라벨(+required/optional) · 테두리 박스 · 헬프 메시지 · 카운터(labelAside) 슬롯
 * 실제 입력 컨트롤은 children으로 받는다.
 */
export function FieldFrame({
  htmlFor,
  size = "lg",
  label,
  required = false,
  optional = false,
  labelAside,
  helpMessage,
  helpMessageId,
  helpTone,
  invalid = false,
  disabled = false,
  controlAlign = "center",
  containerClassName,
  children,
}: FieldFrameProps) {
  const tone: ResolvedHelpTone = invalid ? "error" : (helpTone ?? "default");
  const hasLabelRow = label != null || labelAside != null;

  return (
    <div className={cn("flex w-full flex-col", containerGap[size], containerClassName)}>
      {hasLabelRow && (
        <div className="flex items-center justify-between gap-ds-8">
          {label != null ? (
            <label
              htmlFor={htmlFor}
              className={cn("flex items-center gap-ds-4 text-content-primary", fieldText[size])}
            >
              <span>{label}</span>
              {required && (
                <span className="text-content-error" aria-hidden="true">
                  *
                </span>
              )}
              {optional && <span className="text-content-tertiary">(Optional)</span>}
            </label>
          ) : (
            <span />
          )}
          {labelAside}
        </div>
      )}

      <div
        className={cn(
          fieldBoxBase,
          controlAlign === "start" ? "items-start" : "items-center",
          fieldBoxState(disabled, invalid),
        )}
      >
        {children}
      </div>

      {helpMessage != null && (
        <p id={helpMessageId} className={cn(helpText[size], helpToneColor[tone])}>
          {helpMessage}
        </p>
      )}
    </div>
  );
}
