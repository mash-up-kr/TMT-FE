"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  getGroupDetailQueryKey,
  getListGroupsQueryKey,
  useGroupDetail,
  useUpdateGroup,
} from "@/api/gen/group/group.gen";
import { useGroupTags } from "@/api/gen/group-tag/group-tag.gen";
import { getTmtApiErrorTitle } from "@/api/mutator";
import { getGroupImageUploadErrorTitle, uploadGroupImage } from "@/app/groups/_utils/groupImage";
import { toGroupTagOptions } from "@/app/groups/_utils/groupMappers";
import type { GroupEditFormData, GroupEditSaveResult } from "../_model/groupEdit";
import { toGroupEditFormData, toGroupUpdateRequest } from "../_utils/groupEditMapper";

export function useGroupEdit(groupId: string) {
  const queryClient = useQueryClient();
  const detail = useGroupDetail(groupId);
  const tags = useGroupTags();
  const update = useUpdateGroup();
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const saveGroup = async (
    form: GroupEditFormData,
    groupImageFile?: File,
  ): Promise<GroupEditSaveResult> => {
    try {
      setIsUploadingImage(Boolean(groupImageFile));
      const imageAssetId = groupImageFile ? await uploadGroupImage(groupImageFile) : undefined;
      const request = toGroupUpdateRequest(form);
      const response = await update.mutateAsync({
        groupId,
        data: imageAssetId ? { ...request, imageAssetId } : request,
      });

      queryClient.setQueryData(getGroupDetailQueryKey(groupId), response);
      void queryClient.invalidateQueries({ queryKey: getListGroupsQueryKey() });
      return { success: true };
    } catch (error) {
      const errorTitle = getGroupImageUploadErrorTitle(error) ?? getTmtApiErrorTitle(error);
      return errorTitle ? { success: false, errorTitle } : { success: false };
    } finally {
      setIsUploadingImage(false);
    }
  };

  return {
    status: detail.isPending ? "pending" : detail.isError || !detail.data ? "error" : "ready",
    isOwner: detail.data?.isOwner ?? false,
    form: detail.data ? toGroupEditFormData(detail.data) : undefined,
    tagOptionsState: {
      options: toGroupTagOptions(tags.data),
      status: tags.isPending ? "pending" : tags.isError ? "error" : "success",
    } as const,
    isSaving: isUploadingImage || update.isPending,
    saveGroup,
    retryTagOptions: () => void tags.refetch(),
  };
}
