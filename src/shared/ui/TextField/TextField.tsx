"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode, useId } from "react";
import { cn } from "@/shared/utils/cn";
import { FieldFrame } from "./FieldFrame";
import { controlClass, type FieldSize, type HelpTone } from "./fieldStyles";

export type TextFieldProps = Readonly<
  Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
    size?: FieldSize;
    label?: ReactNode;
    required?: boolean;
    optional?: boolean;
    helpMessage?: ReactNode;
    helpTone?: HelpTone;
    invalid?: boolean;
    /** 입력 영역 우측 아이콘/버튼 슬롯 */
    trailing?: ReactNode;
    containerClassName?: string;
  }
>;

/** 단일 라인 텍스트 입력 필드 (Figma: Text field). */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    id,
    size = "lg",
    label,
    required = false,
    optional = false,
    helpMessage,
    helpTone,
    invalid = false,
    trailing,
    disabled = false,
    className,
    containerClassName,
    "aria-describedby": ariaDescribedby,
    ...rest
  },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const helpId = helpMessage != null ? `${inputId}-help` : undefined;
  const describedBy = [ariaDescribedby, helpId].filter(Boolean).join(" ") || undefined;

  return (
    <FieldFrame
      htmlFor={inputId}
      size={size}
      label={label}
      required={required}
      optional={optional}
      helpMessage={helpMessage}
      helpMessageId={helpId}
      helpTone={helpTone}
      invalid={invalid}
      disabled={disabled}
      containerClassName={containerClassName}
    >
      <input
        ref={ref}
        id={inputId}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={cn(controlClass(size), className)}
        {...rest}
      />
      {trailing != null && (
        <span
          className={cn(
            "flex shrink-0 items-center justify-center text-icon-secondary",
            size === "lg" ? "size-ds-24" : "size-ds-20",
          )}
        >
          {trailing}
        </span>
      )}
    </FieldFrame>
  );
});
