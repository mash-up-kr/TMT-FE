"use client";

import { useGroupDetail } from "@/api/gen/group/group.gen";
import { useJoin, useJoinPreview } from "@/api/gen/group-membership/group-membership.gen";
import { LoadingIcon } from "@/shared/ui/Icons";
import { toReviewCardData } from "@/shared/utils/reviewMapper";
import { useGroupReviewPages } from "../_hooks/useGroupReviewPages";
import type { GroupReviewListState } from "../_model/groupDetail";
import { toGroupDetailViewData } from "../_utils/groupDetailMapper";
import { GroupDetailView } from "./GroupDetailView";

const SERVER_IGNORES_USER_ID = 1;

type GroupDetailContainerProps = {
  groupId: string;
};

export function GroupDetailContainer({ groupId }: GroupDetailContainerProps) {
  const detail = useGroupDetail(groupId);
  const reviews = useGroupReviewPages(groupId, detail.data?.isMember);
  const join = useJoin();
  const joinPreview = useJoinPreview(
    groupId,
    { userId: SERVER_IGNORES_USER_ID },
    { query: { enabled: detail.data?.isMember === false } },
  );

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
      await join.mutateAsync({ groupId, params: { userId: SERVER_IGNORES_USER_ID } });
      void detail.refetch({ throwOnError: false });

      return true;
    } catch {
      return false;
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
      joinAction={{ onJoin: handleJoin, isPending: join.isPending, isError: join.isError }}
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
