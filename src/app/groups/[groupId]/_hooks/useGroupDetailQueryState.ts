import { useGroupDetail } from "@/api/gen/group/group.gen";
import { useJoinPreview } from "@/api/gen/group-membership/group-membership.gen";
import { toReviewCardData } from "@/shared/utils/reviewMapper";
import type { GroupDetailViewData, GroupReviewListState } from "../_model/groupDetail";
import { toGroupDetailViewData } from "../_utils/groupDetailMapper";
import { useGroupReviewPages } from "./useGroupReviewPages";

type GroupDetailQueryState =
  | Readonly<{ status: "pending" }>
  | Readonly<{ status: "error" }>
  | Readonly<{
      status: "ready";
      group: GroupDetailViewData;
      reviewList: GroupReviewListState;
    }>;

export function useGroupDetailQueryState(groupId: string): GroupDetailQueryState {
  const detail = useGroupDetail(groupId);
  const reviews = useGroupReviewPages(groupId, detail.data?.isMember);
  const joinPreview = useJoinPreview(groupId, {
    query: { enabled: detail.data?.isMember === false },
  });

  if (detail.isPending) {
    return { status: "pending" };
  }

  if (!detail.data || detail.isError) {
    return { status: "error" };
  }

  const isNonMember = !detail.data.isMember;

  if (reviews.isPending || (isNonMember && joinPreview.isPending)) {
    return { status: "pending" };
  }

  if (reviews.isError || (isNonMember && joinPreview.isError)) {
    return { status: "error" };
  }

  const reviewItems = reviews.data.pages.flatMap((page) => page.items.map(toReviewCardData));
  const reviewList: GroupReviewListState = reviews.hasNextPage
    ? {
        reviews: reviewItems,
        hasNextPage: true,
        isFetchingNextPage: reviews.isFetchingNextPage,
        onLoadMore: () => reviews.fetchNextPage(),
      }
    : { reviews: reviewItems, hasNextPage: false };

  return {
    status: "ready",
    group: toGroupDetailViewData(detail.data, joinPreview.data),
    reviewList,
  };
}
