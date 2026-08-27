"use client";

import { type ChangeEvent, useId } from "react";
import { PlusIcon, XCircleIcon } from "@/shared/ui/Icons";
import { GroupCreateStepHeader } from "./GroupCreateStepHeader";

type GroupImageStepProps = {
  groupName: string;
  previewUrl?: string;
  onImageSelectAction: (file: File) => void;
  onImageRemoveAction: () => void;
};

export function GroupImageStep({
  groupName,
  previewUrl,
  onImageSelectAction,
  onImageRemoveAction,
}: GroupImageStepProps) {
  const inputId = useId();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);

    if (file) {
      onImageSelectAction(file);
    }

    event.target.value = "";
  };

  return (
    <div className="flex flex-col gap-ds-24">
      <GroupCreateStepHeader title={"그룹의 대표 이미지를\n등록해주세요"} required={false} />

      <div className="flex flex-col items-center gap-ds-12 pt-ds-8">
        <div className="relative size-[120px]">
          <label
            htmlFor={inputId}
            className="flex size-full cursor-pointer items-center justify-center overflow-hidden rounded-ds-full bg-surface-secondary text-icon-tertiary outline-none focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-stroke-interactive-primary"
          >
            <span className="sr-only">그룹 대표 이미지 선택</span>
            {previewUrl ? (
              // biome-ignore lint/performance/noImgElement: 브라우저 object URL은 Next Image로 최적화할 수 없다.
              <img
                src={previewUrl}
                alt="선택한 그룹 대표 이미지"
                className="size-full object-cover"
              />
            ) : (
              <PlusIcon size={24} />
            )}
            <input
              id={inputId}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleChange}
            />
          </label>

          {previewUrl ? (
            <button
              type="button"
              aria-label="그룹 대표 이미지 삭제"
              onClick={onImageRemoveAction}
              className="absolute top-0 right-0 rounded-ds-full bg-surface-primary text-icon-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-interactive-primary"
            >
              <XCircleIcon size={24} />
            </button>
          ) : null}
        </div>
        <p className="max-w-full truncate text-heading-md text-content-primary">{groupName}</p>
      </div>
    </div>
  );
}
