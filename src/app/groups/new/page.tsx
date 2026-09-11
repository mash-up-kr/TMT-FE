"use client";

import { useRouter } from "next/navigation";
import { getTmtApiErrorTitle } from "@/api/mutator";
import { getGroupImageUploadErrorTitle } from "@/app/groups/_utils/groupImage";
import { ROUTES } from "@/shared/constants/routes";
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

      if (createdGroup.reviewShareFailed) {
        toast.error("그룹은 만들었지만 리뷰를 공유하지 못했어요. 그룹에서 다시 공유해 주세요.");
      } else {
        toast.success("그룹 생성이 완료되었어요.");
      }
      router.replace(ROUTES.GROUPS.DETAIL(createdGroup.id));
    } catch (error) {
      toast.error(
        getGroupImageUploadErrorTitle(error) ??
          getTmtApiErrorTitle(error) ??
          "그룹 생성에 실패했어요. 다시 시도해 주세요.",
      );
    }
  };

  return (
    <GroupCreateScreen
      tagOptionsState={groupCreate.tagOptionsState}
      reviewOptionsState={groupCreate.reviewOptionsState}
      isCreating={groupCreate.isCreating}
      onCreateAction={handleCreate}
      onRetryTagOptionsAction={groupCreate.retryTagOptions}
      onLoadMoreReviewOptionsAction={groupCreate.loadMoreReviewOptions}
      onRetryReviewOptionsAction={groupCreate.retryReviewOptions}
    />
  );
}
