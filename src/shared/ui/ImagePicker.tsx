"use client";

import { useId } from "react";
import { CameraIcon, PlusIcon, XCircleIcon } from "@/shared/ui/Icons";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import { cn } from "@/shared/utils/cn";

type ImagePickerBaseProps = {
  id?: string;
  label: string;
  src?: string | null;
  fallbackSrc?: string | { src: string };
  accept: string;
  disabled?: boolean;
  describedBy?: string;
  invalid?: boolean;
  className?: string;
  onSelect: (file: File) => void;
  onImageError?: () => void;
};

type ImagePickerProps = ImagePickerBaseProps &
  ({ variant?: "camera"; onRemove?: never } | { variant: "removable"; onRemove: () => void });

/** 파일 선택과 표시를 공유한다. 검증·object URL 수명·업로드는 사용처가 소유한다. */
export function ImagePicker({
  id,
  label,
  src,
  fallbackSrc,
  accept,
  variant = "camera",
  disabled,
  describedBy,
  invalid,
  className,
  onSelect,
  onRemove,
  onImageError,
}: ImagePickerProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className={cn("relative size-[120px] shrink-0 self-center", className)}>
      <label
        htmlFor={inputId}
        className={cn(
          "relative flex size-full items-center justify-center rounded-ds-full bg-surface-secondary text-icon-tertiary focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-stroke-interactive-primary",
          disabled ? "cursor-default" : "cursor-pointer",
        )}
      >
        <ImageWithFallback
          src={src ?? null}
          {...(fallbackSrc ? { fallbackSrc } : { fallback: <PlusIcon size={24} /> })}
          alt={label}
          className="size-full rounded-ds-full object-cover"
          onError={onImageError}
        />
        {variant === "camera" ? (
          <span
            aria-hidden="true"
            className="absolute right-0 bottom-0 flex rounded-ds-full border border-surface-primary bg-surface-tertiary p-ds-4 text-icon-primary"
          >
            <CameraIcon filled size={20} />
          </span>
        ) : null}
        <input
          id={inputId}
          type="file"
          aria-label={`${label} 선택`}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          accept={accept}
          disabled={disabled}
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.item(0);
            event.target.value = "";
            if (file) onSelect(file);
          }}
        />
      </label>
      {src && variant === "removable" ? (
        <button
          type="button"
          aria-label={`${label} 삭제`}
          disabled={disabled}
          onClick={onRemove}
          className="absolute top-0 right-0 rounded-ds-full bg-surface-primary text-icon-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-interactive-primary"
        >
          <XCircleIcon size={24} />
        </button>
      ) : null}
    </div>
  );
}
