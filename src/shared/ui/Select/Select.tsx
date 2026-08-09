"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { type CSSProperties, type ReactNode, useId } from "react";
import { Checkbox } from "@/shared/ui/Checkbox";
import { FieldFrame, type FieldSize, fieldText, type HelpTone } from "@/shared/ui/FieldFrame";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@/shared/ui/icons";
import { Radio, RadioGroup } from "@/shared/ui/Radio";
import { cn } from "@/shared/utils/cn";

export type SelectOption = Readonly<{
  value: string;
  label: ReactNode;
  /** 라벨 아래 보조 설명 */
  description?: ReactNode;
  disabled?: boolean;
}>;

export type SelectIndicator = "check" | "checkbox" | "radio" | "none";

export type SelectProps = Readonly<{
  items: readonly SelectOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: SelectPrimitive.Root.Props<string | null>["onValueChange"];
  placeholder?: ReactNode;
  size?: FieldSize;
  /** 팝업에 한 번에 보이는 항목 수. 이보다 많으면 스크롤한다. */
  visibleItems?: 4 | 6 | 8;
  /** 항목 왼쪽 선택 표시. `none`은 배경색으로만 구분한다. */
  indicator?: SelectIndicator;
  label?: ReactNode;
  required?: boolean;
  optional?: boolean;
  helpMessage?: ReactNode;
  helpTone?: HelpTone;
  invalid?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  /** 트리거 버튼 클래스 */
  className?: string;
  containerClassName?: string;
  "aria-describedby"?: string;
  "aria-label"?: string;
}>;

const iconSize: Record<FieldSize, number> = {
  lg: 24,
  md: 20,
};

const descriptionText: Record<FieldSize, string> = {
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

function listMaxHeight(size: FieldSize, hasDescription: boolean, visibleItems: number): string {
  const item = [
    "var(--spacing-ds-16)",
    labelLineHeight[size],
    ...(hasDescription ? ["var(--spacing-ds-4)", descriptionLineHeight[size]] : []),
  ].join(" + ");

  return `calc((${item}) * ${visibleItems} + var(--spacing-ds-16))`;
}

const itemBackground = cn(
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

const RADIO_VALUE = "selected";

const EMPTY_MESSAGE = "선택할 수 있는 항목이 없어요";

type ItemIndicatorProps = Readonly<{
  indicator: SelectIndicator;
  selected: boolean;
  disabled: boolean;
}>;

function ItemIndicator({ indicator, selected, disabled }: ItemIndicatorProps) {
  if (indicator === "none" || indicator === "check") {
    return (
      <span className="flex size-ds-16 shrink-0 items-center justify-center">
        {indicator === "check" && selected && (
          <CheckIcon
            size={16}
            className="text-icon-primary group-data-disabled/item:text-icon-disabled"
          />
        )}
      </span>
    );
  }

  if (indicator === "checkbox") {
    return (
      <Checkbox
        checked={selected}
        disabled={disabled}
        render={<span />}
        aria-hidden="true"
        tabIndex={-1}
        className="pointer-events-none"
      />
    );
  }

  return (
    <RadioGroup
      value={selected ? RADIO_VALUE : null}
      disabled={disabled}
      aria-hidden="true"
      className="contents"
    >
      <Radio value={RADIO_VALUE} render={<span />} tabIndex={-1} className="pointer-events-none" />
    </RadioGroup>
  );
}

/** 단일 선택 필드 (Figma: Select field). */
export function Select({
  items,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  size = "lg",
  visibleItems = 8,
  indicator = "check",
  label,
  required = false,
  optional = false,
  helpMessage,
  helpTone,
  invalid = false,
  disabled = false,
  name,
  id,
  className,
  containerClassName,
  "aria-describedby": ariaDescribedby,
  "aria-label": ariaLabel,
}: SelectProps) {
  const reactId = useId();
  const triggerId = id ?? reactId;
  const helpId = helpMessage != null ? `${triggerId}-help` : undefined;
  const describedBy = [ariaDescribedby, helpId].filter(Boolean).join(" ") || undefined;
  const hasDescription = items.some((item) => item.description != null);

  return (
    <SelectPrimitive.Root
      items={items}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      required={required}
      name={name}
    >
      <FieldFrame
        htmlFor={triggerId}
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
        boxClassName={cn(
          "p-0",
          !disabled && !invalid && "has-[[data-popup-open]]:border-stroke-field-pressed",
        )}
      >
        <SelectPrimitive.Trigger
          id={triggerId}
          aria-label={ariaLabel}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={cn(
            "flex w-full items-center justify-between gap-ds-12 px-ds-16 py-ds-12 text-left",
            "outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-interactive-primary",
            fieldText[size],
            disabled ? "cursor-not-allowed text-content-disabled" : "text-content-primary",
            className,
          )}
        >
          <SelectPrimitive.Value
            placeholder={placeholder}
            className={cn(
              "min-w-0 flex-1 truncate",
              disabled
                ? "data-placeholder:text-content-disabled"
                : "data-placeholder:text-content-tertiary",
            )}
          />
          <SelectPrimitive.Icon
            className={cn(
              "flex shrink-0 items-center justify-center",
              disabled ? "text-icon-disabled" : "text-icon-secondary",
            )}
            render={(props, state) => (
              <span {...props}>
                {state.open ? (
                  <ChevronUpIcon size={iconSize[size]} />
                ) : (
                  <ChevronDownIcon size={iconSize[size]} />
                )}
              </span>
            )}
          />
        </SelectPrimitive.Trigger>
      </FieldFrame>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
          className="z-popup outline-none"
          sideOffset={4}
          alignItemWithTrigger={false}
        >
          <SelectPrimitive.Popup
            className={cn(
              "w-(--anchor-width) origin-(--transform-origin) rounded-ds-md bg-surface-primary shadow-floating outline-none",
              "transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none",
              "data-starting-style:scale-98 data-starting-style:opacity-0",
              "data-ending-style:scale-98 data-ending-style:opacity-0",
            )}
          >
            {items.length === 0 ? (
              <p
                role="status"
                className={cn(
                  "px-ds-16 py-ds-12 text-center text-content-tertiary",
                  fieldText[size],
                )}
              >
                {EMPTY_MESSAGE}
              </p>
            ) : (
              <SelectPrimitive.List
                style={
                  {
                    "--select-list-max-height": listMaxHeight(size, hasDescription, visibleItems),
                    "--select-thumb-radius": "2px 6px 6px 2px / 2px",
                  } as CSSProperties
                }
                className={cn(
                  "max-h-[min(var(--available-height),var(--select-list-max-height))]",
                  "overflow-y-auto overscroll-contain py-ds-8",
                  "[&::-webkit-scrollbar]:w-ds-8",
                  "[&::-webkit-scrollbar-track]:my-ds-8 [&::-webkit-scrollbar-track]:bg-transparent",
                  "[&::-webkit-scrollbar-thumb]:bg-icon-secondary",
                  "[&::-webkit-scrollbar-thumb]:border-r-4 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-clip-padding",
                  "[&::-webkit-scrollbar-thumb]:[border-radius:var(--select-thumb-radius)]",
                  "[&::-webkit-scrollbar-thumb]:min-h-[120px]",
                )}
              >
                {items.map((item) => (
                  <SelectPrimitive.Item
                    key={item.value}
                    value={item.value}
                    disabled={item.disabled}
                    label={typeof item.label === "string" ? item.label : undefined}
                    className={cn(
                      "group/item flex select-none items-center gap-ds-8 px-ds-16 py-ds-8 outline-none",
                      itemBackground,
                    )}
                    render={(itemProps, state) => (
                      <div {...itemProps}>
                        <ItemIndicator
                          indicator={indicator}
                          selected={state.selected}
                          disabled={state.disabled}
                        />
                        <SelectPrimitive.ItemText className="flex min-w-0 flex-1 flex-col gap-ds-4">
                          <span
                            className={cn(
                              "truncate text-content-primary group-data-disabled/item:text-content-disabled",
                              fieldText[size],
                            )}
                          >
                            {item.label}
                          </span>
                          {item.description != null && (
                            <span
                              className={cn(
                                "truncate text-content-tertiary group-data-disabled/item:text-content-disabled",
                                descriptionText[size],
                              )}
                            >
                              {item.description}
                            </span>
                          )}
                        </SelectPrimitive.ItemText>
                      </div>
                    )}
                  />
                ))}
              </SelectPrimitive.List>
            )}
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
