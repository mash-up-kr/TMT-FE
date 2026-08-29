"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useListSaves } from "@/api/gen/save/save.gen";
import { ROUTES } from "@/shared/constants/routes";

/**
 * 본문이 자리를 잡은 뒤 시트를 올리기까지의 간격.
 * 진입과 동시에 덮으면 시트가 화면의 일부처럼 보이고, 너무 늦으면 조작을 끊는다.
 */
const PROMPT_DELAY_MS = 450;

type ContinueDraftPromptOptions = Readonly<{
  /** 마이페이지 본문이 그려졌는지. 그려지기 전에는 시트를 올리지 않는다. */
  ready: boolean;
}>;

/**
 * 마이페이지 진입 때마다 작성 중인 리뷰를 확인해 이어쓰기 시트를 올린다.
 *
 * 열림 상태는 조회 결과에서 파생하지 않고 effect로 뒤늦게 켠다. 파생하면 데이터가 캐시에
 * 있을 때 첫 렌더부터 열린 채로 그려져 올라오는 동작 없이 이미 떠 있는 화면이 된다.
 *
 * 목록은 파라미터를 주지 않아 이어쓰기 선택 화면과 같은 캐시를 쓴다. 시트에서 바로 넘어갈 때
 * 목록을 다시 받지 않기 위한 것이다.
 */
export function useContinueDraftPrompt({ ready }: ContinueDraftPromptOptions) {
  const router = useRouter();
  const saves = useListSaves();
  const [isOpen, setIsOpen] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);

  const drafts = saves.data?.items ?? [];
  const firstDraft = drafts.at(0);
  const shouldPrompt = ready && !hasPrompted && firstDraft !== undefined;

  useEffect(() => {
    if (!shouldPrompt) {
      return;
    }

    const timer = window.setTimeout(() => {
      setHasPrompted(true);
      setIsOpen(true);
    }, PROMPT_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [shouldPrompt]);

  const continueWriting = () => {
    if (firstDraft === undefined) {
      return;
    }

    setIsOpen(false);
    // 초안이 하나뿐이면 고를 것이 없으므로 선택 화면을 건너뛴다.
    router.push(
      drafts.length === 1 ? ROUTES.REVIEWS.DRAFT(firstDraft.saveId) : ROUTES.REVIEWS.CONTINUE,
    );
  };

  return { isOpen, onOpenChange: setIsOpen, continueWriting };
}
