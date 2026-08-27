"use client";

import { useRouter } from "next/navigation";
import { groupDetailPathAfterCreate } from "@/shared/constants/routes";
import { toast } from "@/shared/ui/Toast";
import { GroupCreateScreen } from "./_components/GroupCreateScreen";
import { useGroupCreate } from "./_hooks/useGroupCreate";
import type { GroupCreateSubmission } from "./_model/groupCreate";

export default function GroupCreatePage() {
  const router = useRouter();
  const groupCreate = useGroupCreate();

  const handleCreate = async (submission: GroupCreateSubmission) => {
    try {
      const createdGroup = await groupCreate.create(submission);
      toast.success("그룹 생성이 완료되었어요.");
      router.replace(groupDetailPathAfterCreate(createdGroup.id));
    } catch {
      toast.error("그룹 생성에 실패했어요. 다시 시도해 주세요.");
    }
  };

  return (
    <GroupCreateScreen
      tagOptionsState={groupCreate.tagOptionsState}
      isCreating={groupCreate.isCreating}
      onCreateAction={handleCreate}
      onRetryTagOptionsAction={groupCreate.retryTagOptions}
    />
  );
}
