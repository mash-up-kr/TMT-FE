"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyReviewsQueryKey, myReviews } from "@/api/gen/profile/profile.gen";
import type { GroupReviewOptionsState } from "../_model/groupCreate";
import { toGroupReviewOptions } from "../_utils/groupCreateMapper";

const PAGE_SIZE = 20;

/**
 * 새 그룹에 공유할 수 있는 내 리뷰. 서버가 미완성 저장을 빼고 최신순으로 내린다.
 *
 * 키는 `getMyReviewsQueryKey` 접두사 아래에 둔다. 리뷰를 저장한 뒤의 무효화가 이 목록까지 닿는다.
 */
export function useGroupReviewOptions() {
  const pages = useInfiniteQuery({
    queryKey: [...getMyReviewsQueryKey(), "pages"],
    queryFn: ({ pageParam }) => myReviews({ cursor: pageParam, limit: PAGE_SIZE }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
  });

  const reviewOptionsState: GroupReviewOptionsState = {
    options: toGroupReviewOptions(pages.data?.pages.flatMap((page) => page.items)),
    status: pages.isPending ? "pending" : pages.isError ? "error" : "success",
    hasNextPage: pages.hasNextPage,
    isFetchingNextPage: pages.isFetchingNextPage,
  };

  return {
    reviewOptionsState,
    loadMoreReviewOptions: () => void pages.fetchNextPage(),
    retryReviewOptions: () => void pages.refetch(),
  };
}
