"use client";

import { useEffect, useRef } from "react";
import { useShareReviewsToGroup } from "@/shared/hooks/useShareReviewsToGroup";

type ShareReviewToGroupOptions = Readonly<{
  /** 이미 가입한 그룹에서 리뷰를 쓰고 돌아왔을 때만 참이다. 미가입이면 PUT이 403이다. */
  enabled: boolean;
  groupId: string | null;
  reviewId: string | null;
}>;

/**
 * 그룹에서 시작한 리뷰가 완성되면 그 그룹에 공유한다.
 *
 * 기존 공유를 보존하는 합집합 처리는 `useShareReviewsToGroup`이 맡는다. 여기서는 완료 화면에
 * 머무는 동안 한 번만 보내는 것만 책임진다. 멱등이라 다시 보내도 결과는 같지만, 화면이 다시
 * 그려질 때마다 요청이 나가지 않게 보낸 리뷰를 기억해 둔다.
 */
export function useShareReviewToGroup({ enabled, groupId, reviewId }: ShareReviewToGroupOptions) {
  const { shareReviews } = useShareReviewsToGroup(groupId ?? "");
  const sharedReviewIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || groupId === null || reviewId === null) {
      return;
    }

    if (sharedReviewIdRef.current === reviewId) {
      return;
    }

    sharedReviewIdRef.current = reviewId;
    void shareReviews([reviewId]);
  }, [enabled, groupId, reviewId, shareReviews]);
}
