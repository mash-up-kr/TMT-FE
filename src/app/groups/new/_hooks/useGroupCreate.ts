"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getListGroupsQueryKey, useCreateGroup } from "@/api/gen/group/group.gen";
import { useGroupTags } from "@/api/gen/group-tag/group-tag.gen";
import { uploadGroupImage } from "@/app/groups/_utils/groupImage";
import { toGroupTagOptions } from "@/app/groups/_utils/groupMappers";
import type { GroupCreateSubmission, GroupTagOptionsState } from "../_model/groupCreate";
import { toCreatedGroupData, toGroupCreateRequest } from "../_utils/groupCreateMapper";

export function useGroupCreate() {
  const queryClient = useQueryClient();
  const tags = useGroupTags();
  const createGroup = useCreateGroup();
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const tagOptionsState: GroupTagOptionsState = {
    options: toGroupTagOptions(tags.data),
    status: tags.isPending ? "pending" : tags.isError ? "error" : "success",
  };

  const create = async ({ draft, groupImageFile }: GroupCreateSubmission) => {
    try {
      setIsUploadingImage(Boolean(groupImageFile));
      const groupImageId = groupImageFile
        ? await uploadGroupImage(groupImageFile)
        : draft.groupImageId;
      const response = await createGroup.mutateAsync({
        data: toGroupCreateRequest({ ...draft, groupImageId }),
      });
      void queryClient.invalidateQueries({ queryKey: getListGroupsQueryKey() });

      return toCreatedGroupData(response);
    } finally {
      setIsUploadingImage(false);
    }
  };

  return {
    create,
    isCreating: isUploadingImage || createGroup.isPending,
    retryTagOptions: () => void tags.refetch(),
    tagOptionsState,
  };
}
