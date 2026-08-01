"use client";

import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";
import { CheckIcon } from "./icons";

type CheckboxProps = Omit<ComponentProps<typeof BaseCheckbox.Root>, "className" | "children"> & {
  className?: string;
};

function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <BaseCheckbox.Root
      data-slot="checkbox"
      className={cn(
        "flex size-ds-16 shrink-0 items-center justify-center rounded-ds-xs border-md border-stroke-primary bg-surface-primary outline-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-interactive-primary",
        "data-unchecked:hover:not-data-disabled:border-stroke-primary-hovered data-unchecked:active:not-data-disabled:border-stroke-primary-pressed",
        "data-checked:not-data-disabled:border-transparent data-checked:not-data-disabled:bg-surface-interactive-primary data-checked:hover:not-data-disabled:bg-surface-interactive-primary-hovered data-checked:active:not-data-disabled:bg-surface-interactive-primary-pressed",
        "data-disabled:border-stroke-disabled data-disabled:bg-surface-disabled data-checked:data-disabled:border-transparent",
        className,
      )}
      {...props}
    >
      <BaseCheckbox.Indicator className="flex text-icon-interactive-inverse data-disabled:text-icon-disabled">
        <CheckIcon thick size={12} />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
}

type CheckboxFieldProps = CheckboxProps & {
  children?: ReactNode;
};

function CheckboxField({ className, children, ...props }: CheckboxFieldProps) {
  return (
    <label
      data-slot="checkbox-field"
      className={cn("inline-flex items-center gap-ds-8", className)}
    >
      <Checkbox className="peer" {...props} />
      <span className="text-body-lg-medium text-content-primary peer-data-disabled:text-content-disabled">
        {children}
      </span>
    </label>
  );
}

type CheckboxGroupProps = ComponentProps<typeof BaseCheckboxGroup>;

function CheckboxGroup({ className, ...props }: CheckboxGroupProps) {
  return (
    <BaseCheckboxGroup
      data-slot="checkbox-group"
      className={cn("flex flex-col items-stretch gap-ds-12", className)}
      {...props}
    />
  );
}

export type { CheckboxFieldProps, CheckboxGroupProps, CheckboxProps };
export { Checkbox, CheckboxField, CheckboxGroup };
