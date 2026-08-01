"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { type CSSProperties, type ReactNode, useId } from "react";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@/shared/ui/icons";
import { FieldFrame, type FieldSize, type HelpTone } from "@/shared/ui/TextField";
import { fieldText } from "@/shared/ui/TextField/fieldStyles";
import { cn } from "@/shared/utils/cn";

export type SelectOption = Readonly<{
  value: string;
  label: ReactNode;
  /** 라벨 아래 보조 설명 */
  description?: ReactNode;
  disabled?: boolean;
}>;

export type SelectProps = Readonly<{
  items: readonly SelectOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: SelectPrimitive.Root.Props<string | null>["onValueChange"];
  placeholder?: ReactNode;
  size?: FieldSize;
  /** 팝업에 한 번에 보이는 항목 수. 이보다 많으면 스크롤한다. */
  visibleItems?: 4 | 6 | 8;
  label?: ReactNode;
  required?: boolean;
  optional?: boolean;
  helpMessage?: ReactNode;
  helpTone?: HelpTone;
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  form?: string;
  id?: string;
  /** 트리거 버튼 클래스 */
  className?: string;
  containerClassName?: string;
  popupClassName?: string;
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
  "data-selected:bg-surface-selected",
  "data-selected:not-data-disabled:data-highlighted:bg-surface-selected-hovered",
  "data-selected:not-data-disabled:active:bg-surface-selected-pressed",
  "data-selected:not-data-disabled:data-highlighted:active:bg-surface-selected-pressed",
  "data-disabled:pointer-events-none data-disabled:bg-surface-disabled",
);

/** 단일 선택 필드 (Figma: Select field). */
export function Select({
  items,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  size = "lg",
  visibleItems = 8,
  label,
  required = false,
  optional = false,
  helpMessage,
  helpTone,
  invalid = false,
  disabled = false,
  readOnly = false,
  name,
  form,
  id,
  className,
  containerClassName,
  popupClassName,
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
      readOnly={readOnly}
      required={required}
      name={name}
      form={form}
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
          className="z-50 outline-none"
          sideOffset={4}
          alignItemWithTrigger={false}
        >
          <SelectPrimitive.Popup
            className={cn(
              "w-(--anchor-width) origin-(--transform-origin) rounded-ds-md bg-surface-primary shadow-floating outline-none",
              "transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none",
              "data-starting-style:scale-98 data-starting-style:opacity-0",
              "data-ending-style:scale-98 data-ending-style:opacity-0",
              popupClassName,
            )}
          >
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
                >
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
                  <SelectPrimitive.ItemIndicator className="flex shrink-0 items-center justify-center text-icon-interactive-primary">
                    <CheckIcon size={iconSize[size]} />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
