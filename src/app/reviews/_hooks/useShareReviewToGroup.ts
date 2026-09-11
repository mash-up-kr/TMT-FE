"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import {
  getListReviewSharesQueryKey,
  listReviewShares,
  replaceReviewShares,
} from "@/api/gen/group-membership/group-membership.gen";

const PAGE_SIZE = 20;

type ShareReviewToGroupOptions = Readonly<{
  /** 이미 가입한 그룹에서 리뷰를 쓰고 돌아왔을 때만 참이다. 미가입이면 PUT이 403이다. */
  enabled: boolean;
  groupId: string | null;
  reviewId: string | null;
}>;

/**
 * 그룹에서 시작한 리뷰가 완성되면 그 그룹에 공유한다.
 *
 * 공유 API는 보낸 목록이 최종 집합이 되는 전체 교체다. 방금 쓴 리뷰만 보내면 먼저 공유해 둔
 * 리뷰가 전부 풀리므로, 이미 공유된 것을 모두 모아 새 리뷰를 더한 합집합을 보낸다. 목록이
 * 여러 장으로 나뉘어 오기 때문에 한 장만 보고 보내면 뒷장에 있던 공유가 사라진다.
 *
 * 완료 화면에 머무는 동안 한 번만 보낸다. 멱등이라 다시 보내도 결과는 같지만, 화면이 다시
 * 그려질 때마다 요청이 나가지 않게 보낸 리뷰를 기억해 둔다.
 */
export function useShareReviewToGroup({ enabled, groupId, reviewId }: ShareReviewToGroupOptions) {
  const queryClient = useQueryClient();
  const sharedReviewIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || groupId === null || reviewId === null) {
      return;
    }

    if (sharedReviewIdRef.current === reviewId) {
      return;
    }

    sharedReviewIdRef.current = reviewId;

    void (async () => {
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

      if (sharedIds.includes(reviewId)) {
        return;
      }

      await replaceReviewShares(groupId, { reviewIds: [...sharedIds, reviewId] });

      await queryClient.invalidateQueries({ queryKey: getListReviewSharesQueryKey(groupId) });
      await queryClient.invalidateQueries({ queryKey: ["group-reviews", groupId] });
    })();
  }, [enabled, groupId, reviewId, queryClient]);
}
