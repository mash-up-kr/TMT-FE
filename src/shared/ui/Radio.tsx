"use client";

import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import type { ComponentProps } from "react";
import { cn } from "@/shared/utils/cn";

type RadioProps<Value = string> = Omit<
  ComponentProps<typeof BaseRadio.Root<Value>>,
  "className" | "children"
> & {
  className?: string;
};

const baseStyles =
  "relative size-ds-16 shrink-0 overflow-hidden rounded-ds-full border-lg border-stroke-primary bg-surface-primary outline-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-interactive-primary";

const uncheckedStyles =
  "data-unchecked:hover:not-data-disabled:border-stroke-primary-hovered " +
  "data-unchecked:active:not-data-disabled:border-stroke-primary-pressed";

const checkedStyles =
  "data-checked:not-data-disabled:border-transparent data-checked:not-data-disabled:bg-surface-interactive-primary " +
  "data-checked:hover:not-data-disabled:bg-surface-interactive-primary-hovered " +
  "data-checked:active:not-data-disabled:bg-surface-interactive-primary-pressed";

const disabledStyles = "data-disabled:border-stroke-disabled data-disabled:bg-surface-primary";

export function Radio<Value = string>({ className, ...props }: RadioProps<Value>) {
  return (
    <BaseRadio.Root
      data-slot="radio"
      className={cn(baseStyles, uncheckedStyles, checkedStyles, disabledStyles, className)}
      {...props}
    >
      <BaseRadio.Indicator className="absolute inset-0 flex items-center justify-center">
        <span className="size-ds-8 rounded-ds-full bg-surface-primary" />
      </BaseRadio.Indicator>
    </BaseRadio.Root>
  );
}

type RadioGroupProps<Value = string> = ComponentProps<typeof BaseRadioGroup<Value>>;

export function RadioGroup<Value = string>({ className, ...props }: RadioGroupProps<Value>) {
  return (
    <BaseRadioGroup
      data-slot="radio-group"
      className={cn("flex flex-col items-stretch gap-ds-12", className)}
      {...props}
    />
  );
}

export type { RadioGroupProps, RadioProps };
