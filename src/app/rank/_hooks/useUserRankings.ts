"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import type { ListUserRankingsSort } from "@/api/gen/_model/listUserRankingsSort.gen";
import { getListUserRankingsQueryKey, listUserRankings } from "@/api/gen/랭킹/랭킹.gen";

const PAGE_SIZE = 10;

/**
 * 유저 활동량 랭킹 목록 (TMT-436). 서버가 `sort` 축 내림차순으로 정렬해 커서로 잘라 준다.
 * 화면은 그 순서를 그대로 쓴다. 전 유저 대상이고 리뷰 0건 사용자도 포함한다.
 *
 * 축을 바꾸면 이전 커서가 INVALID_CURSOR라 키에 축을 실어, 축이 다른 페이지가 한 캐시에 섞이지
 * 않게 한다. 키는 생성 키에 접두사를 두어 다른 조회와 같은 무효화 범위에 든다.
 */
export function useUserRankings(sort: ListUserRankingsSort) {
  return useInfiniteQuery({
    queryKey: [...getListUserRankingsQueryKey({ sort }), "pages"],
    queryFn: ({ pageParam }) => listUserRankings({ sort, cursor: pageParam, limit: PAGE_SIZE }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
  });
}
