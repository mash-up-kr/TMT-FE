"use client";

import { type ChangeEvent, type ComponentProps, type ReactNode, useId, useState } from "react";
import { controlClass, FieldFrame, type FieldSize, type HelpTone } from "@/shared/ui/FieldFrame";
import { cn } from "@/shared/utils/cn";

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
    /** 글자 수 표시 위치. 기본값은 기존과 같은 라벨 우측이다. */
    counterPlacement?: "label" | "field";
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
  counterPlacement = "label",
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
  const displayLength = maxLength != null ? Math.min(currentLength, maxLength) : currentLength;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) {
      setUncontrolledCount(event.target.value.length);
    }

    onChange?.(event);
  };

  const counter = hasCounter ? (
    <span id={countId} className="text-body-sm-medium text-content-tertiary">
      <span className={invalid ? "text-content-error" : "text-content-secondary"}>
        {displayLength}
      </span>
      {` / ${maxLength}`}
    </span>
  ) : undefined;

  const inFieldCounter = counterPlacement === "field" && hasCounter;

  const control = (
    <textarea
      {...rest}
      ref={ref}
      id={textareaId}
      rows={rows}
      disabled={disabled}
      required={required}
      maxLength={maxLength}
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className={cn(controlClass(size), "resize-none", inFieldCounter && "block w-full", className)}
    />
  );

  return (
    <FieldFrame
      htmlFor={textareaId}
      size={size}
      label={label}
      required={required}
      optional={optional}
      labelAside={counterPlacement === "label" ? counter : undefined}
      helpMessage={helpMessage}
      helpMessageId={helpId}
      helpTone={helpTone}
      invalid={invalid}
      disabled={disabled}
      controlAlign="start"
      containerClassName={containerClassName}
    >
      {inFieldCounter ? (
        // 카운터를 textarea 위에 겹치면 스크롤된 텍스트가 그 아래를 지나가 가려진다.
        // 형제로 두어 스크롤 영역 밖에 자기 자리를 갖게 한다.
        <div className="min-w-0 flex-1">
          {control}
          <span className="mt-ds-4 block text-right">{counter}</span>
        </div>
      ) : (
        control
      )}
    </FieldFrame>
  );
}
