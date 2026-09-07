"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useListSaves } from "@/api/gen/save/save.gen";
import {
  continueDraftForGroupJoinPath,
  newReviewForGroupJoinPath,
} from "@/shared/constants/reviewJoinGroup";
import { useReviewReturnTo } from "@/shared/hooks/useReviewEntryPath";
import { isContinuableSave } from "@/shared/utils/continuableSave";

type GroupReviewEntryOptions = Readonly<{
  /** 비회원일 때만 초안을 미리 조회한다. 회원은 이 흐름에 들어오지 않는다. */
  enabled: boolean;
}>;

/**
 * 티켓 부족 시트의 `리뷰 작성하기`가 어디로 갈지 정한다.
 *
 * 쓰다 만 리뷰가 있으면 이어 쓸지 먼저 묻고, 없으면 바로 매장 검색으로 보낸다. 초안 목록은
 * 시트를 열기 전에 미리 받아 두어 누르는 순간 판단할 수 있게 한다. 아직 못 받았으면 버튼을
 * 기다리는 상태로 두고, 받는 데 실패하면 초안이 없는 것으로 보고 새로 쓰기로 보낸다. 물어볼 수
 * 없다고 리뷰 작성까지 막지는 않는다.
 *
 * 목록 요청에 파라미터를 주지 않아 마이페이지 안내 시트·이어쓰기 선택 화면과 같은 캐시를 쓴다.
 */
export function useGroupReviewEntry(groupId: string, { enabled }: GroupReviewEntryOptions) {
  const router = useRouter();
  const returnTo = useReviewReturnTo();
  const saves = useListSaves(undefined, { query: { enabled } });
  const [isContinueSheetOpen, setIsContinueSheetOpen] = useState(false);

  const hasContinuableDraft = (saves.data?.items ?? []).some(isContinuableSave);

  const startNew = () => {
    setIsContinueSheetOpen(false);
    router.push(newReviewForGroupJoinPath(groupId, returnTo));
  };

  const startWriting = () => {
    if (saves.isSuccess && hasContinuableDraft) {
      setIsContinueSheetOpen(true);
      return;
    }
    startNew();
  };

  const continueDraft = () => {
    setIsContinueSheetOpen(false);
    router.push(continueDraftForGroupJoinPath(groupId, returnTo));
  };

  return {
    startWriting,
    /** 초안 목록을 아직 받는 중이라 어디로 갈지 정할 수 없는 동안 참이다. */
    isChecking: enabled && saves.isPending,
    continueSheet: {
      open: isContinueSheetOpen,
      onOpenChange: setIsContinueSheetOpen,
      startNew,
      continueDraft,
    },
  };
}
