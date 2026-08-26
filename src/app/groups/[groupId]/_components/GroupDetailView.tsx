"use client";

import { useGroupDetail } from "@/api/gen/group/group.gen";
import { useJoinPreview } from "@/api/gen/group-membership/group-membership.gen";
import { toReviewCardData } from "@/app/_utils/reviewMapper";
import { LoadingIcon } from "@/shared/ui/Icons";
import { useGroupReviewPages } from "../_hooks/useGroupReviewPages";
import { toGroupDetailScreenData } from "../_utils/toGroupDetailScreenData";
import { GroupDetailScreen } from "./GroupDetailScreen";

const SERVER_IGNORES_USER_ID = 1;

type GroupDetailViewProps = {
  groupId: string;
};

export function GroupDetailView({ groupId }: GroupDetailViewProps) {
  const detail = useGroupDetail(groupId);
  const reviews = useGroupReviewPages(groupId, detail.data?.isMember);
  const joinPreview = useJoinPreview(
    groupId,
    { userId: SERVER_IGNORES_USER_ID },
    { query: { enabled: detail.data?.isMember === false } },
  );

  if (detail.isPending || reviews.isPending) {
    return <GroupDetailLoading />;
  }

  if (!detail.data || detail.isError || reviews.isError) {
    return <GroupDetailError />;
  }

  return (
    <GroupDetailScreen
      group={toGroupDetailScreenData(detail.data, joinPreview.data)}
      reviews={reviews.data.pages.flatMap((page) => page.items.map(toReviewCardData))}
      hasNextReviewPage={reviews.hasNextPage}
      isFetchingNextReviewPage={reviews.isFetchingNextPage}
      onLoadMoreReviews={() => reviews.fetchNextPage()}
    />
  );
}

export function GroupDetailLoading() {
  return (
    <div className="flex flex-1 items-center justify-center bg-surface-secondary">
      <LoadingIcon className="animate-spin text-icon-tertiary" />
    </div>
  );
}

// 차후 페이지 뷰가 생기면 조금 더 서비스에 맞는 형태로 처리해둘 것
export function GroupDetailError() {
  return (
    <div role="alert" className="flex flex-1 items-center justify-center bg-surface-secondary">
      <p className="text-body-md-regular text-content-secondary">
        그룹 상세 데이터를 불러오지 못했어요.
      </p>
    </div>
  );
}
