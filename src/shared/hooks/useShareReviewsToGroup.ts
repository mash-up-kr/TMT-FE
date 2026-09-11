import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import {
  getListReviewSharesQueryKey,
  listReviewShares,
  replaceReviewShares,
} from "@/api/gen/group-membership/group-membership.gen";
import { getGroupReviewsQueryKey } from "@/shared/constants/queryKeys";

const PAGE_SIZE = 20;

/**
 * 이미 이 그룹에 공유된 내 리뷰 id를 모두 모은다.
 *
 * 목록이 여러 장으로 나뉘어 오므로 첫 장만 보면 뒷장의 공유가 빠진다. 끝까지 돈다.
 */
async function collectSharedReviewIds(groupId: string): Promise<string[]> {
  const sharedIds: string[] = [];
  let cursor: string | undefined;

  do {
    const page = await listReviewShares(groupId, { cursor, limit: PAGE_SIZE });

    for (const item of page.items) {
      if (item.isShared) {
        sharedIds.push(item.reviewId);
      }
    }

    cursor = page.hasNext ? (page.nextCursor ?? undefined) : undefined;
  } while (cursor !== undefined);

  return sharedIds;
}

/**
 * 이미 가입한 그룹에 내 리뷰를 공유한다. 리뷰 완료 화면의 자동 공유와 그룹 상세의 공유 선택
 * 화면이 함께 쓴다.
 *
 * 공유 API는 보낸 목록이 최종 집합이 되는 전체 교체다. 새로 고른 것만 보내면 먼저 공유해 둔
 * 리뷰가 전부 풀리므로, 이미 공유된 것을 모두 모아 합집합으로 보낸다. 그래서 호출부는 "추가할
 * 리뷰"만 넘기면 되고, 기존 공유를 보존하는 책임은 여기 한 곳이 진다.
 *
 * 성공 여부만 돌려주고 그다음 할 일(화면 이동)은 호출부가 정한다. 실패 안내는 시안이 없어
 * 띄우지 않는다.
 *
 * `isPending`은 뮤테이션이 아니라 캐시 정리까지 포함한 전 구간이다. 응답이 온 순간 버튼이
 * 풀리면 화면이 아직 공유 전 목록을 그리는 동안 한 번 더 눌린다.
 */
export function useShareReviewsToGroup(groupId: string) {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const shareReviews = useCallback(
    async (reviewIds: readonly string[]): Promise<boolean> => {
      setIsPending(true);
      try {
        const sharedIds = await collectSharedReviewIds(groupId);
        const nextIds = [...new Set([...sharedIds, ...reviewIds])];

        if (nextIds.length === sharedIds.length) {
          return true;
        }

        await replaceReviewShares(groupId, { reviewIds: nextIds });
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: getListReviewSharesQueryKey(groupId) }),
          queryClient.invalidateQueries({ queryKey: getGroupReviewsQueryKey(groupId) }),
        ]);
        return true;
      } catch {
        return false;
      } finally {
        setIsPending(false);
      }
    },
    [groupId, queryClient],
  );

  return { shareReviews, isPending };
}
