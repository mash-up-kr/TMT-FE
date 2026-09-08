"use client";

import { GROUP_IMAGE_ACCEPT } from "@/app/groups/_utils/groupImage";
import { ImagePicker } from "@/shared/ui/ImagePicker";
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
  return (
    <div className="flex flex-col gap-ds-24">
      <GroupCreateStepHeader title={"그룹의 대표 이미지를\n등록해주세요"} required={false} />

      <div className="flex flex-col items-center gap-ds-12 pt-ds-8">
        <ImagePicker
          label="그룹 대표 이미지"
          src={previewUrl}
          accept={GROUP_IMAGE_ACCEPT}
          variant="removable"
          onSelect={onImageSelectAction}
          onRemove={onImageRemoveAction}
        />
        <p className="max-w-full truncate text-heading-md text-content-primary">{groupName}</p>
      </div>
    </div>
  );
}
