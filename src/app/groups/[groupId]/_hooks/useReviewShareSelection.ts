"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGroupDetail } from "@/api/gen/group/group.gen";
import { ROUTES } from "@/shared/constants/routes";
import { useJoinGroup } from "@/shared/hooks/useJoinGroup";
import { useShareReviewsToGroup } from "@/shared/hooks/useShareReviewsToGroup";
import { toReviewShareItems } from "../_utils/reviewShareMappers";
import { useReviewSharePages } from "./useReviewSharePages";

/** 이미 공유된 리뷰를 보존하고, 선택한 리뷰로 가입 또는 추가 공유한다. */
export function useReviewShareSelection(groupId: string, mode: "join" | "share") {
  const router = useRouter();
  const detail = useGroupDetail(groupId);
  const pages = useReviewSharePages(groupId);
  const join = useJoinGroup(groupId);
  const share = useShareReviewsToGroup(groupId);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const items = toReviewShareItems(pages.data?.pages.flatMap((page) => page.items));
  // 이미 공유된 리뷰. 가입 전에는 공유된 게 있을 수 없어 mode를 따로 보지 않는다.
  const lockedIds = new Set(items.filter((item) => item.isShared).map((item) => item.reviewId));
  // 새로 고른 것만. 잠긴 리뷰는 합집합으로 항상 실리므로 여기서 세지 않는다.
  const newIds = selectedIds.filter((id) => !lockedIds.has(id));
  const isPending = mode === "join" ? join.isPending : share.isPending;

  const leave = () => router.replace(ROUTES.GROUPS.DETAIL(groupId));
  const submit = async (reviewIds: readonly string[]) => {
    const didSubmit =
      mode === "join"
        ? await join.joinGroup({ sourceReviewIds: reviewIds })
        : await share.shareReviews(reviewIds);
    if (!didSubmit) {
      return;
    }
    router.replace(ROUTES.GROUPS.DETAIL(groupId));
  };

  return {
    groupName: detail.data?.name,
    pages,
    items,
    selectedIds: [...new Set([...lockedIds, ...selectedIds])],
    setSelectedIds,
    isPending,
    canShare: newIds.length > 0,
    leave,
    skip: () => submit([]),
    submitSelected: () => submit(mode === "join" ? selectedIds : newIds),
  };
}
