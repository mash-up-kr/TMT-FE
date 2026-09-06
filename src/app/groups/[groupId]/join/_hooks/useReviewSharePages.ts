import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getListReviewSharesQueryKey,
  listReviewShares,
} from "@/api/gen/group-membership/group-membership.gen";

const PAGE_SIZE = 20;

/**
 * 가입하려는 그룹에 공유할 수 있는 내 리뷰 목록. 가입 전에도 조회된다 (H §3-1, 403 없음).
 *
 * 공유는 가입 요청에 실어 보내므로(TMT-241) 전체 교체 PUT처럼 모든 페이지를 다 받을 필요는 없다.
 * 체크한 것만 보내면 된다.
 *
 * 키는 생성 훅과 같은 접두사를 쓴다. 있는지만 보는 조회(`useGroupShareEntry`)와 이 목록이 같은
 * 접두사 아래 있어야 리뷰를 쓴 뒤 한 번의 무효화로 둘 다 정리된다.
 */
export function useReviewSharePages(groupId: string) {
  return useInfiniteQuery({
    queryKey: [...getListReviewSharesQueryKey(groupId), "pages"],
    queryFn: ({ pageParam }) => listReviewShares(groupId, { cursor: pageParam, limit: PAGE_SIZE }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
  });
}
