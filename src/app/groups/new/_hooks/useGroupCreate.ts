"use client";

import { useQueryClient } from "@tanstack/react-query";
import { getListGroupsQueryKey, useCreateGroup } from "@/api/gen/group/group.gen";
import { useGroupTags } from "@/api/gen/group-tag/group-tag.gen";
import { toGroupTagOptions } from "@/app/groups/_utils/groupMappers";
import type { GroupCreateSubmission, GroupTagOptionsState } from "../_model/groupCreate";
import { toCreatedGroupData, toGroupCreateRequest } from "../_utils/groupCreateMapper";

export function useGroupCreate() {
  const queryClient = useQueryClient();
  const tags = useGroupTags();
  const createGroup = useCreateGroup();
  const tagOptionsState: GroupTagOptionsState = {
    options: toGroupTagOptions(tags.data),
    status: tags.isPending ? "pending" : tags.isError ? "error" : "success",
  };

  const create = async ({ draft }: GroupCreateSubmission) => {
    const response = await createGroup.mutateAsync({ data: toGroupCreateRequest(draft) });
    void queryClient.invalidateQueries({ queryKey: getListGroupsQueryKey() });

    return toCreatedGroupData(response);
  };

  return {
    create,
    isCreating: createGroup.isPending,
    retryTagOptions: () => void tags.refetch(),
    tagOptionsState,
  };
}
