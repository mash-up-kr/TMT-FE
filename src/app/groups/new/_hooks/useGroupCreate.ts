"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getListGroupsQueryKey, useCreateGroup } from "@/api/gen/group/group.gen";
import { useReplaceReviewShares } from "@/api/gen/group-membership/group-membership.gen";
import { useGroupTags } from "@/api/gen/group-tag/group-tag.gen";
import { uploadGroupImage } from "@/app/groups/_utils/groupImage";
import { toGroupTagOptions } from "@/app/groups/_utils/groupMappers";
import type {
  GroupCreateResult,
  GroupCreateSubmission,
  GroupTagOptionsState,
} from "../_model/groupCreate";
import { toCreatedGroupData, toGroupCreateRequest } from "../_utils/groupCreateMapper";
import { useGroupReviewOptions } from "./useGroupReviewOptions";

export function useGroupCreate() {
  const queryClient = useQueryClient();
  const tags = useGroupTags();
  const reviewOptions = useGroupReviewOptions();
  const createGroup = useCreateGroup();
  const replaceReviewShares = useReplaceReviewShares();
  // 업로드 → 생성 → 공유 전 구간. 요청 사이에 버튼이 풀려 그룹이 두 번 만들어지지 않게 한다.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const tagOptionsState: GroupTagOptionsState = {
    options: toGroupTagOptions(tags.data),
    status: tags.isPending ? "pending" : tags.isError ? "error" : "success",
  };

  // 방금 만든 그룹이라 공유된 리뷰가 없다. 고른 목록을 그대로 최종 집합으로 보낸다.
  const shareReviews = async (groupId: string, reviewIds: string[]) => {
    if (reviewIds.length === 0) {
      return true;
    }

    try {
      await replaceReviewShares.mutateAsync({ groupId, data: { reviewIds } });
      return true;
    } catch {
      return false;
    }
  };

  const create = async ({
    draft,
    groupImageFile,
  }: GroupCreateSubmission): Promise<GroupCreateResult> => {
    try {
      setIsSubmitting(true);
      const groupImageId = groupImageFile
        ? await uploadGroupImage(groupImageFile)
        : draft.groupImageId;
      const response = await createGroup.mutateAsync({
        data: toGroupCreateRequest({ ...draft, groupImageId }),
      });
      void queryClient.invalidateQueries({ queryKey: getListGroupsQueryKey() });

      const createdGroup = toCreatedGroupData(response);
      const didShare = await shareReviews(createdGroup.id, draft.reviewIds);

      return { ...createdGroup, reviewShareFailed: !didShare };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    create,
    isCreating: isSubmitting,
    retryTagOptions: () => void tags.refetch(),
    tagOptionsState,
    ...reviewOptions,
  };
}
