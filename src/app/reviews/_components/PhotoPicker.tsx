"use client";

import { type ChangeEvent, useEffect, useId, useRef } from "react";
import { PlusIcon, XCircleIcon } from "@/shared/ui/Icons";
import { cn } from "@/shared/utils/cn";
import { MAX_REVIEW_PHOTO_COUNT } from "../_constants/review";
import type { ReviewPhoto } from "../_model/photo";

const cellHeight = "h-[120px]";
const cellWidth = "w-[120px]";

type AddPhotoButtonProps = Readonly<{
  count: number;
  onAdd: (files: readonly File[]) => void;
  className?: string;
}>;

function AddPhotoButton({ count, onAdd, className }: AddPhotoButtonProps) {
  const inputId = useId();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files !== null && files.length > 0) {
      onAdd(Array.from(files));
    }

    // 같은 파일을 지웠다가 다시 고를 수 있어야 하므로 값을 비운다.
    event.target.value = "";
  };

  return (
    <label
      htmlFor={inputId}
      className={cn(
        cellHeight,
        "flex cursor-pointer flex-col items-center justify-center gap-ds-4",
        "rounded-ds-md border border-stroke-primary border-dashed bg-surface-secondary text-content-tertiary",
        "outline-none focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-stroke-interactive-primary",
        className,
      )}
    >
      <PlusIcon size={24} />
      <span className="text-body-md-medium">
        {count}/{MAX_REVIEW_PHOTO_COUNT}
      </span>
      {/* multiple을 일부러 뺐다. HTML에는 파일 개수 상한이 없어 열어두면 남은 자리보다 많이
          골라도 막을 수 없고, 넘친 만큼이 안내 없이 사라진다. */}
      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="sr-only"
      />
    </label>
  );
}

type PhotoPickerProps = Readonly<{
  photos: readonly ReviewPhoto[];
  onAdd: (files: readonly File[]) => void;
  onRemove: (id: string) => void;
}>;

export function PhotoPicker({ photos, onAdd, onRemove }: PhotoPickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const previousCount = useRef(photos.length);

  useEffect(() => {
    const grew = photos.length > previousCount.current;
    previousCount.current = photos.length;

    if (!grew || scrollRef.current === null) {
      return;
    }

    scrollRef.current.scrollTo({ left: scrollRef.current.scrollWidth });
  }, [photos.length]);

  if (photos.length === 0) {
    return <AddPhotoButton count={0} onAdd={onAdd} className="w-full" />;
  }

  return (
    <div
      ref={scrollRef}
      className="-mx-ds-20 scroll-smooth overflow-x-auto px-ds-20 motion-reduce:scroll-auto"
    >
      <ul className="flex w-max items-start gap-ds-8">
        {photos.map((photo, index) => (
          <li key={photo.id} className={cn(cellHeight, cellWidth, "relative shrink-0")}>
            {/* biome-ignore lint/performance/noImgElement: object URL은 최적화할 수 없다 */}
            <img
              src={photo.previewUrl}
              alt={`첨부한 사진 ${index + 1}`}
              className="size-full rounded-ds-md object-cover"
            />
            <button
              type="button"
              onClick={() => onRemove(photo.id)}
              aria-label={`첨부한 사진 ${index + 1} 삭제`}
              className={cn(
                "absolute top-ds-4 right-ds-4 rounded-ds-full bg-surface-primary text-icon-primary",
                "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-interactive-primary",
              )}
            >
              <XCircleIcon size={20} className="block" />
            </button>
          </li>
        ))}

        {photos.length < MAX_REVIEW_PHOTO_COUNT && (
          <li className="shrink-0">
            <AddPhotoButton count={photos.length} onAdd={onAdd} className={cellWidth} />
          </li>
        )}
      </ul>
    </div>
  );
}
