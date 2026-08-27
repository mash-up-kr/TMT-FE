import { useInfiniteQuery } from "@tanstack/react-query";
import { groupReviews } from "@/api/gen/group/group.gen";

const REVIEW_PAGE_SIZE = 3;

export function useGroupReviewPages(groupId: string, isMember: boolean | undefined) {
  return useInfiniteQuery({
    queryKey: ["group-reviews", groupId, isMember],
    queryFn: ({ pageParam }) =>
      groupReviews(groupId, {
        cursor: pageParam,
        limit: REVIEW_PAGE_SIZE,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      isMember && lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
    enabled: isMember !== undefined,
  });
}
