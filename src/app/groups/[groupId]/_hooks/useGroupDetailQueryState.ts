import type { UseQueryResult } from "@tanstack/react-query";
import {
  type JoinPreviewQueryError,
  type JoinPreviewQueryResult,
  useJoinPreview,
} from "@/api/gen/group-membership/group-membership.gen";
import { toReviewCardData } from "@/shared/utils/reviewMapper";
import type {
  GroupDetailViewData,
  GroupJoinPreviewState,
  GroupReviewListState,
} from "../_model/groupDetail";
import { toGroupDetailViewData } from "../_utils/groupDetailMapper";
import { useGroupReviewPages } from "./useGroupReviewPages";
import { useSuspenseGroupDetail } from "./useSuspenseGroupDetail";

type GroupDetailQueryState = Readonly<{
  group: GroupDetailViewData;
  reviewList: GroupReviewListState;
  joinPreview: GroupJoinPreviewState;
}>;

function toReviewListState(reviews: ReturnType<typeof useGroupReviewPages>): GroupReviewListState {
  if (reviews.isPending) {
    return { status: "pending" };
  }

  if (reviews.isError || !reviews.data) {
    return { status: "error", onRetry: () => reviews.refetch() };
  }

  const reviewItems = reviews.data.pages.flatMap((page) => page.items.map(toReviewCardData));

  if (!reviews.hasNextPage) {
    return { status: "ready", reviews: reviewItems, hasNextPage: false };
  }

  return {
    status: "ready",
    reviews: reviewItems,
    hasNextPage: true,
    isFetchingNextPage: reviews.isFetchingNextPage,
    onLoadMore: () => reviews.fetchNextPage(),
  };
}

function toJoinPreviewState(
  isMember: boolean,
  joinPreview: UseQueryResult<JoinPreviewQueryResult, JoinPreviewQueryError>,
): GroupJoinPreviewState {
  if (isMember) {
    return { status: "not-required" };
  }

  if (joinPreview.isPending) {
    return { status: "pending" };
  }

  if (joinPreview.isError || !joinPreview.data) {
    return { status: "error", onRetry: () => joinPreview.refetch() };
  }

  return {
    status: "ready",
    availableTicketCount: joinPreview.data.availableTicketCount,
    isJoinable: joinPreview.data.joinable,
  };
}

export function useGroupDetailQueryState(groupId: string): GroupDetailQueryState {
  const { data: detail } = useSuspenseGroupDetail(groupId);
  const reviews = useGroupReviewPages(groupId, detail.isMember);
  const joinPreview = useJoinPreview(groupId, {
    query: { enabled: detail.isMember === false },
  });

  return {
    group: toGroupDetailViewData(detail),
    reviewList: toReviewListState(reviews),
    joinPreview: toJoinPreviewState(detail.isMember, joinPreview),
  };
}
