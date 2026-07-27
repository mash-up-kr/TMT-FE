"use client";

import { type ChangeEvent, type ComponentProps, type ReactNode, useId, useState } from "react";
import { cn } from "@/shared/utils/cn";
import { FieldFrame } from "./FieldFrame";
import { controlClass, type FieldSize, type HelpTone } from "./fieldStyles";

export type TextareaProps = Readonly<
  Omit<ComponentProps<"textarea">, "rows"> & {
    size?: FieldSize;
    label?: ReactNode;
    required?: boolean;
    optional?: boolean;
    helpMessage?: ReactNode;
    helpTone?: HelpTone;
    invalid?: boolean;
    /** 라벨 우측에 `현재 / 최대` 글자 수 표시 (maxLength 필요) */
    showCount?: boolean;
    rows?: number;
    containerClassName?: string;
  }
>;

/** 멀티 라인 텍스트 입력 필드 (Figma: Text area). */
export function Textarea({
  id,
  ref,
  size = "lg",
  label,
  required = false,
  optional = false,
  helpMessage,
  helpTone,
  invalid = false,
  showCount = false,
  rows = 4,
  disabled = false,
  maxLength,
  value,
  defaultValue,
  onChange,
  className,
  containerClassName,
  "aria-describedby": ariaDescribedby,
  ...rest
}: TextareaProps) {
  const reactId = useId();
  const textareaId = id ?? reactId;
  const helpId = helpMessage != null ? `${textareaId}-help` : undefined;
  const hasCounter = showCount && maxLength != null;
  // 글자 수는 aria-live로 매 입력마다 읽지 않고, describedby로 포커스 시 한 번 알린다.
  const countId = hasCounter ? `${textareaId}-count` : undefined;
  const describedBy = [ariaDescribedby, helpId, countId].filter(Boolean).join(" ") || undefined;

  const isControlled = value != null;
  const [uncontrolledCount, setUncontrolledCount] = useState(
    () => String(defaultValue ?? "").length,
  );
  const currentLength = isControlled ? String(value).length : uncontrolledCount;

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    if (!isControlled) {
      setUncontrolledCount(event.target.value.length);
    }

    onChange?.(event);
  }

  const counter = hasCounter ? (
    <span id={countId} className="text-body-sm-medium text-content-tertiary">
      <span className={invalid ? "text-content-error" : "text-content-secondary"}>
        {currentLength}
      </span>
      {` / ${maxLength}`}
    </span>
  ) : undefined;

  return (
    <FieldFrame
      htmlFor={textareaId}
      size={size}
      label={label}
      required={required}
      optional={optional}
      labelAside={counter}
      helpMessage={helpMessage}
      helpMessageId={helpId}
      helpTone={helpTone}
      invalid={invalid}
      disabled={disabled}
      controlAlign="start"
      containerClassName={containerClassName}
    >
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        disabled={disabled}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        aria-invalid={invalid || undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy}
        className={cn(controlClass(size), "resize-none", className)}
        {...rest}
      />
    </FieldFrame>
  );
}
