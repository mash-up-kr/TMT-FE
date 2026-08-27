"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getListGroupsQueryKey, useCreateGroup } from "@/api/gen/group/group.gen";
import { useGroupTags } from "@/api/gen/group-tag/group-tag.gen";
import { toGroupTagOptions } from "@/app/groups/_utils/groupMappers";
import { groupDetailPathAfterCreate } from "@/shared/constants/routes";
import { toast } from "@/shared/ui/Toast";
import type { GroupCreateSubmission } from "../_model/groupCreate";
import { toCreatedGroupData, toGroupCreateRequest } from "../_utils/groupCreateMapper";
import { GroupCreateScreen } from "./GroupCreateScreen";

export function GroupCreateContainer() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const tags = useGroupTags();
  const createGroup = useCreateGroup({
    mutation: {
      onSuccess: (response) => {
        const createdGroup = toCreatedGroupData(response);
        void queryClient.invalidateQueries({ queryKey: getListGroupsQueryKey() });
        toast.success("그룹 생성이 완료되었어요.");
        router.replace(groupDetailPathAfterCreate(createdGroup.id));
      },
      onError: () => {
        toast.error("그룹 생성에 실패했어요. 다시 시도해 주세요.");
      },
    },
  });

  const handleCreate = ({ draft }: GroupCreateSubmission) => {
    createGroup.mutate({ data: toGroupCreateRequest(draft) });
  };

  return (
    <GroupCreateScreen
      tagOptionsState={{
        options: toGroupTagOptions(tags.data),
        status: tags.isPending ? "pending" : tags.isError ? "error" : "success",
      }}
      isCreating={createGroup.isPending}
      onCreateAction={handleCreate}
      onRetryTagOptionsAction={() => void tags.refetch()}
    />
  );
}
