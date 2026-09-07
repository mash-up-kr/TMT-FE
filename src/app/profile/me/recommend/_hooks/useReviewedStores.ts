"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  getReviewedPlacesQueryKey,
  reviewedPlaces,
} from "@/api/gen/recommendation/recommendation.gen";
import { toRecommendStores } from "../_utils/recommendMapper";

const PAGE_SIZE = 50;

/**
 * 격자에 놓을, 내가 리뷰한 매장 전부.
 *
 * 커서 페이지를 끝까지 이어 받는다. 시안의 격자에는 `더 보기`가 없어서 받다 만 페이지는 곧
 * 고를 수 없는 매장이 된다. 연쇄를 화면이 아니라 이 훅이 소유해야 격자가 페이지를 모른다.
 *
 * 키는 생성 훅과 같은 접두사를 쓴다. 리뷰를 쓴 뒤 한 번의 무효화로 이 목록까지 정리된다.
 */
export function useReviewedStores() {
  const query = useInfiniteQuery({
    queryKey: [...getReviewedPlacesQueryKey(), "pages"],
    queryFn: ({ pageParam }) => reviewedPlaces({ cursor: pageParam, limit: PAGE_SIZE }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
    select: (data) => toRecommendStores(data.pages.flatMap((page) => page.items)),
  });

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = query;

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    stores: query.data ?? [],
    isError: query.isError,
    refetch: query.refetch,
  };
}
