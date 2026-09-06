import { useJoinPreview } from "@/api/gen/group-membership/group-membership.gen";
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

export function useGroupDetailQueryState(groupId: string): GroupDetailQueryState {
  const { data: detail } = useSuspenseGroupDetail(groupId);
  const reviews = useGroupReviewPages(groupId, detail.isMember);
  const joinPreview = useJoinPreview(groupId, {
    query: { enabled: detail.isMember === false },
  });

  const reviewList: GroupReviewListState = reviews.isPending
    ? { status: "pending" }
    : reviews.isError || !reviews.data
      ? { status: "error", onRetry: () => reviews.refetch() }
      : (() => {
          const reviewItems = reviews.data.pages.flatMap((page) =>
            page.items.map(toReviewCardData),
          );

          return reviews.hasNextPage
            ? {
                status: "ready" as const,
                reviews: reviewItems,
                hasNextPage: true as const,
                isFetchingNextPage: reviews.isFetchingNextPage,
                onLoadMore: () => reviews.fetchNextPage(),
              }
            : { status: "ready" as const, reviews: reviewItems, hasNextPage: false as const };
        })();

  const joinPreviewState: GroupJoinPreviewState = detail.isMember
    ? { status: "not-required" }
    : joinPreview.isPending
      ? { status: "pending" }
      : joinPreview.isError || !joinPreview.data
        ? { status: "error", onRetry: () => joinPreview.refetch() }
        : {
            status: "ready",
            availableTicketCount: joinPreview.data.availableTicketCount,
            isJoinable: joinPreview.data.joinable,
          };

  return {
    group: toGroupDetailViewData(detail),
    reviewList,
    joinPreview: joinPreviewState,
  };
}
