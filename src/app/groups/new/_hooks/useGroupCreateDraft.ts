"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "@/shared/ui/Toast";
import type { GroupCreateDraft } from "../_model/groupCreate";

const MAX_GROUP_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const NON_IMAGE_MESSAGE = "이미지 파일만 업로드할 수 있어요.";
const OVERSIZE_MESSAGE = "5MB 이하 사진만 업로드할 수 있어요.";

const INITIAL_DRAFT: GroupCreateDraft = {
  groupName: "",
  summaryDescription: "",
  foodCategoryId: "",
  regionIds: [],
  detailedDescription: "",
};

type SelectedGroupImage = {
  file: File;
  previewUrl: string;
};

export function useGroupCreateDraft(initialDraft?: Partial<GroupCreateDraft>) {
  const [draft, setDraft] = useState<GroupCreateDraft>(() => ({
    ...INITIAL_DRAFT,
    ...initialDraft,
  }));
  const [groupImage, setGroupImage] = useState<SelectedGroupImage>();
  const groupImageRef = useRef(groupImage);
  groupImageRef.current = groupImage;

  useEffect(() => {
    return () => {
      if (groupImageRef.current) {
        URL.revokeObjectURL(groupImageRef.current.previewUrl);
      }
    };
  }, []);

  const updateDraft = useCallback((patch: Partial<GroupCreateDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
  }, []);

  const selectGroupImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error(NON_IMAGE_MESSAGE);
      return;
    }

    if (file.size > MAX_GROUP_IMAGE_SIZE_BYTES) {
      toast.error(OVERSIZE_MESSAGE);
      return;
    }

    if (groupImageRef.current) {
      URL.revokeObjectURL(groupImageRef.current.previewUrl);
    }

    const selectedImage = { file, previewUrl: URL.createObjectURL(file) };
    groupImageRef.current = selectedImage;
    setGroupImage(selectedImage);
    setDraft((current) => ({ ...current, groupImageId: undefined }));
  }, []);

  const removeGroupImage = useCallback(() => {
    if (groupImageRef.current) {
      URL.revokeObjectURL(groupImageRef.current.previewUrl);
    }

    groupImageRef.current = undefined;
    setGroupImage(undefined);
    setDraft((current) => ({ ...current, groupImageId: undefined }));
  }, []);

  return {
    draft,
    updateDraft,
    groupImage,
    selectGroupImage,
    removeGroupImage,
  };
}
