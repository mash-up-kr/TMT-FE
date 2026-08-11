"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { type CSSProperties, type ReactNode, useId } from "react";
import { Checkbox } from "@/shared/ui/Checkbox";
import { FieldFrame, type FieldSize, fieldText, type HelpTone } from "@/shared/ui/FieldFrame";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@/shared/ui/icons";
import { Radio, RadioGroup } from "@/shared/ui/Radio";
import { cn } from "@/shared/utils/cn";
import {
  descriptionText,
  iconSize,
  itemBackground,
  itemLayout,
  listMaxHeight,
  listScroll,
  popupSurface,
  SCROLL_THUMB_RADIUS,
} from "./selectStyles";

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

function SelectEmpty({ size }: Readonly<{ size: FieldSize }>) {
  return (
    <p
      role="status"
      className={cn("px-ds-16 py-ds-12 text-center text-content-tertiary", fieldText[size])}
    >
      {EMPTY_MESSAGE}
    </p>
  );
}

type SelectOptionRowProps = Readonly<{
  item: SelectOption;
  indicator: SelectIndicator;
  size: FieldSize;
}>;

function SelectOptionRow({ item, indicator, size }: SelectOptionRowProps) {
  return (
    <SelectPrimitive.Item
      value={item.value}
      disabled={item.disabled}
      label={typeof item.label === "string" ? item.label : undefined}
      className={cn(itemLayout, itemBackground)}
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
  );
}

type SelectListProps = Readonly<{
  items: readonly SelectOption[];
  indicator: SelectIndicator;
  size: FieldSize;
  visibleItems: number;
}>;

function SelectList({ items, indicator, size, visibleItems }: SelectListProps) {
  const hasDescription = items.some((item) => item.description != null);

  return (
    <SelectPrimitive.List
      style={
        {
          "--select-list-max-height": listMaxHeight(size, hasDescription, visibleItems),
          "--select-thumb-radius": SCROLL_THUMB_RADIUS,
        } as CSSProperties
      }
      className={listScroll}
    >
      {items.map((item) => (
        <SelectOptionRow key={item.value} item={item} indicator={indicator} size={size} />
      ))}
    </SelectPrimitive.List>
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
          <SelectPrimitive.Popup className={popupSurface}>
            {items.length === 0 ? (
              <SelectEmpty size={size} />
            ) : (
              <SelectList
                items={items}
                indicator={indicator}
                size={size}
                visibleItems={visibleItems}
              />
            )}
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
