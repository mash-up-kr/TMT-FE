"use client";

import { useListReviewShares } from "@/api/gen/group-membership/group-membership.gen";

type GroupShareEntryOptions = Readonly<{
  /** 티켓이 있어 가입 팝업이 `가입하기`로 뜨는 비회원일 때만 미리 조회한다. */
  enabled: boolean;
}>;

/**
 * 가입 팝업의 `가입하기`가 바로 가입할지, 공유할 리뷰를 먼저 고르게 할지 정한다.
 *
 * 공유할 내 리뷰가 하나라도 있으면 공유 선택 화면(시안 1046:5297)으로 보내고, 없으면 고를 게
 * 없으니 바로 가입한다. 목록은 팝업을 열기 전에 미리 받아 두어 누르는 순간 판단할 수 있게 한다.
 * 받는 데 실패하면 리뷰가 없는 것으로 보고 바로 가입한다 — 공유는 선택이라(H §0) 물어볼 수
 * 없다고 가입까지 막지는 않는다.
 *
 * 있는지만 알면 되므로 한 건만 받는다. 실제 목록은 공유 화면이 따로 받는다.
 */
export function useGroupShareEntry(groupId: string, { enabled }: GroupShareEntryOptions) {
  const shares = useListReviewShares(groupId, { limit: 1 }, { query: { enabled } });

  return {
    hasReviewsToShare: shares.isSuccess && shares.data.items.length > 0,
    /** 목록을 아직 받는 중이라 어디로 갈지 정할 수 없는 동안 참이다. */
    isChecking: enabled && shares.isPending,
  };
}
