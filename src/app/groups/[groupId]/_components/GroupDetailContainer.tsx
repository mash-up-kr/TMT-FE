"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  getGroupDetailQueryKey,
  getListGroupsQueryKey,
  useGroupDetail,
} from "@/api/gen/group/group.gen";
import { useJoin, useJoinPreview, useLeave } from "@/api/gen/group-membership/group-membership.gen";
import { LoadingIcon } from "@/shared/ui/Icons";
import { toReviewCardData } from "@/shared/utils/reviewMapper";
import { useGroupReviewPages } from "../_hooks/useGroupReviewPages";
import type { GroupReviewListState } from "../_model/groupDetail";
import { toGroupDetailViewData } from "../_utils/groupDetailMapper";
import { getGroupLeaveErrorTitle } from "../_utils/groupLeaveError";
import { GroupDetailView } from "./GroupDetailView";

type GroupDetailContainerProps = {
  groupId: string;
  initialFirstReviewSheetOpen?: boolean;
};

export function GroupDetailContainer({
  groupId,
  initialFirstReviewSheetOpen,
}: GroupDetailContainerProps) {
  const queryClient = useQueryClient();
  const detail = useGroupDetail(groupId);
  const reviews = useGroupReviewPages(groupId, detail.data?.isMember);
  const join = useJoin();
  const leave = useLeave();
  const joinPreview = useJoinPreview(groupId, {
    query: { enabled: detail.data?.isMember === false },
  });

  if (detail.isPending) {
    return <GroupDetailLoading />;
  }

  if (!detail.data || detail.isError) {
    return <GroupDetailError />;
  }

  const isNonMember = !detail.data.isMember;

  if (reviews.isPending || (isNonMember && joinPreview.isPending)) {
    return <GroupDetailLoading />;
  }

  if (reviews.isError || (isNonMember && joinPreview.isError)) {
    return <GroupDetailError />;
  }

  const handleJoin = async () => {
    try {
      await join.mutateAsync({ groupId });
      void detail.refetch({ throwOnError: false });

      return true;
    } catch {
      return false;
    }
  };
  const handleLeave = async () => {
    try {
      await leave.mutateAsync({ groupId });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getGroupDetailQueryKey(groupId) }),
        queryClient.invalidateQueries({ queryKey: getListGroupsQueryKey() }),
      ]);

      return { success: true } as const;
    } catch (error) {
      return { success: false, errorTitle: getGroupLeaveErrorTitle(error) } as const;
    }
  };
  const reviewItems = reviews.data.pages.flatMap((page) => page.items.map(toReviewCardData));
  const reviewList: GroupReviewListState = reviews.hasNextPage
    ? {
        reviews: reviewItems,
        hasNextPage: true,
        isFetchingNextPage: reviews.isFetchingNextPage,
        onLoadMore: () => reviews.fetchNextPage(),
      }
    : { reviews: reviewItems, hasNextPage: false };

  return (
    <GroupDetailView
      group={toGroupDetailViewData(detail.data, joinPreview.data)}
      reviewList={reviewList}
      joinAction={{ onJoin: handleJoin, isPending: join.isPending }}
      initialFirstReviewSheetOpen={initialFirstReviewSheetOpen}
      leaveAction={{
        onLeaveAction: handleLeave,
        isPending: leave.isPending,
      }}
    />
  );
}

// 이것도 공용 suspense로 해도 좋을 듯
export function GroupDetailLoading() {
  return (
    <div className="flex flex-1 items-center justify-center bg-surface-secondary">
      <LoadingIcon className="animate-spin text-icon-tertiary" />
    </div>
  );
}

// 차후 페이지 뷰가 생기면 조금 더 서비스에 맞는 형태로 처리해둘 것
// 공용 ErrorBoundary 같은 걸로 처리 하면 좋을 듯
export function GroupDetailError() {
  return (
    <div role="alert" className="flex flex-1 items-center justify-center bg-surface-secondary">
      <p className="text-body-md-regular text-content-secondary">
        그룹 상세 데이터를 불러오지 못했어요.
      </p>
    </div>
  );
}
