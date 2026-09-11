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

/** 그룹마다 지금 줄 서 있는 공유 작업. 없으면 키가 없다. */
const shareQueueByGroup = new Map<string, Promise<void>>();

/**
 * 같은 그룹의 공유 작업을 한 번에 하나씩 돌린다.
 *
 * 공유는 "지금 공유된 것을 읽고 → 합쳐서 → 전체 교체"다. 둘이 동시에 읽으면 둘 다 같은 집합에서
 * 출발해, 나중 PUT이 먼저 더한 것을 지운다. 완료 화면의 자동 공유와 선택 화면의 수동 공유는
 * 서로 다른 훅 인스턴스라 컴포넌트 상태로는 막을 수 없다. 그래서 모듈에 그룹별 줄을 두고, 앞
 * 작업이 끝난 뒤에 시작한다.
 *
 * 앞 작업의 실패는 뒷 작업을 막지 않는다. 줄에는 결과와 무관하게 끝났다는 사실만 남기고, 결과는
 * 각자 부른 쪽이 받는다. 줄이 비면 키를 지워 맵이 자라지 않게 한다.
 */
async function runInGroupQueue<T>(groupId: string, task: () => Promise<T>): Promise<T> {
  const previous = shareQueueByGroup.get(groupId) ?? Promise.resolve();
  const current = previous.then(task);
  const settled = current.then(
    () => undefined,
    () => undefined,
  );

  shareQueueByGroup.set(groupId, settled);

  try {
    return await current;
  } finally {
    // 내 뒤에 누가 줄을 섰으면 그쪽이 지운다.
    if (shareQueueByGroup.get(groupId) === settled) {
      shareQueueByGroup.delete(groupId);
    }
  }
}

/**
 * 이미 가입한 그룹에 내 리뷰를 공유한다. 리뷰 완료 화면의 자동 공유와 그룹 상세의 공유 선택
 * 화면이 함께 쓴다.
 *
 * 공유 API는 보낸 목록이 최종 집합이 되는 전체 교체다. 새로 고른 것만 보내면 먼저 공유해 둔
 * 리뷰가 전부 풀리므로, 이미 공유된 것을 모두 모아 합집합으로 보낸다. 그래서 호출부는 "추가할
 * 리뷰"만 넘기면 되고, 기존 공유를 보존하는 책임은 여기 한 곳이 진다.
 *
 * 같은 그룹의 공유는 한 번에 하나씩 돈다(`runInGroupQueue`). 완료 화면의 자동 공유와 선택
 * 화면의 수동 공유가 겹쳐도 나중 것이 먼저 것을 지우지 않는다.
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
        // 이 그룹의 앞 공유가 끝난 뒤에 읽기 시작한다. 이유는 runInGroupQueue 참고.
        return await runInGroupQueue(groupId, async () => {
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
        });
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
