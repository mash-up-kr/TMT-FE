"use client";

import { useId } from "react";
import { StarIcon } from "@/shared/ui/Icons";
import { cn } from "@/shared/utils/cn";

const MAX_RATING = 5;

const starSize = "size-[44px]";

type StarRatingFieldProps = Readonly<{
  label: string;
  value: number;
  onChange: (value: number) => void;
}>;

export function StarRatingField({ label, value, onChange }: StarRatingFieldProps) {
  const name = useId();

  return (
    <fieldset>
      <legend className="mb-ds-12 text-body-lg-medium text-content-primary">{label}</legend>

      <div className="flex">
        {Array.from({ length: MAX_RATING }, (_, index) => {
          const score = index + 1;
          const filled = score <= value;

          return (
            <label
              key={score}
              className={cn(
                starSize,
                "flex cursor-pointer items-center justify-center",
                "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-stroke-interactive-primary",
                filled ? "text-icon-interactive-primary" : "text-surface-tertiary",
              )}
            >
              <input
                type="radio"
                name={name}
                value={score}
                checked={score === value}
                onChange={() => onChange(score)}
                className="sr-only"
              />
              <span className="sr-only">{score}점</span>
              <StarIcon size={44} />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
