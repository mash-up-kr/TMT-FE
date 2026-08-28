"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getGroupImageValidationError } from "@/app/groups/_utils/groupImage";
import { toast } from "@/shared/ui/Toast";
import type { GroupCreateDraft } from "../_model/groupCreate";

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
    const validationError = getGroupImageValidationError(file);

    if (validationError) {
      toast.error(validationError);
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
