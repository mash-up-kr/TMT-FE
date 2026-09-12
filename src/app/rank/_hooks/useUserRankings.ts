"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getListUserRankingsQueryKey, listUserRankings } from "@/api/gen/랭킹/랭킹.gen";

const PAGE_SIZE = 10;

/**
 * 유저 활동량 랭킹 목록 (TMT-436). 서버가 리뷰 수 내림차순으로 정렬해 커서로 잘라 준다.
 *
 * 화면은 그 순서를 그대로 쓰고, 그룹을 만든 사람만 남기는 건 mapper가 한다. 순서를 바꾸지
 * 않으므로 페이지 단위로 받아도 순위가 어긋나지 않는다.
 *
 * 키는 생성 키에 접두사를 두어 다른 조회와 같은 무효화 범위에 든다.
 */
export function useUserRankings() {
  return useInfiniteQuery({
    queryKey: [...getListUserRankingsQueryKey(), "pages"],
    queryFn: ({ pageParam }) => listUserRankings({ cursor: pageParam, limit: PAGE_SIZE }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
  });
}
