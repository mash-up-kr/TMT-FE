"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useListSaves } from "@/api/gen/save/save.gen";
import { ROUTES } from "@/shared/constants/routes";
import { useReviewReturnTo } from "@/shared/hooks/useReviewEntryPath";
import { isContinuableSave } from "@/shared/utils/continuableSave";
import { withReviewReturnTo } from "@/shared/utils/reviewNavigation";

/**
 * 본문이 자리를 잡은 뒤 시트를 올리기까지의 간격.
 * 진입과 동시에 덮으면 시트가 화면의 일부처럼 보이고, 너무 늦으면 조작을 끊는다.
 */
const PROMPT_DELAY_MS = 450;

/**
 * 안내를 이미 띄웠다는 사실을 세션 동안 들고 있는 자리.
 * 탭을 벗어나면 layout이 내려가 컴포넌트 상태로는 남지 않는다.
 */
const PROMPTED_STORAGE_KEY = "tmt:continue-draft-prompted";

function hasPromptedInSession(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.sessionStorage.getItem(PROMPTED_STORAGE_KEY) === "true";
  } catch {
    // 저장소가 막힌 환경에서는 기억하지 못한다. 안내가 다시 뜰 뿐 화면은 정상 동작한다.
    return false;
  }
}

function markPromptedInSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(PROMPTED_STORAGE_KEY, "true");
  } catch {
    // 위와 같다.
  }
}

type ContinueDraftPromptOptions = Readonly<{
  /** 마이페이지 본문이 그려졌는지. 그려지기 전에는 시트를 올리지 않는다. */
  ready: boolean;
}>;

/**
 * 작성 중인 리뷰가 있으면 이어쓰기 시트를 올린다. **접속당 한 번만** 띄운다 (TMT-286).
 *
 * 띄웠다는 사실은 sessionStorage가 소유한다. 컴포넌트 상태로 두면 마이페이지를 벗어날 때
 * layout이 내려가면서 함께 사라져, 돌아올 때마다 다시 뜬다. 탭 이동만 버티면 되는 값이
 * 아니라 세션 전체를 살아야 하는 값이다.
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
  const returnTo = useReviewReturnTo();
  const [isOpen, setIsOpen] = useState(false);
  // 초기값을 저장소에서 읽지 않는다. 서버 렌더와 첫 클라이언트 렌더가 어긋나 hydration이 깨진다.
  const [hasPrompted, setHasPrompted] = useState(false);

  const drafts = (saves.data?.items ?? []).filter(isContinuableSave);
  const firstDraft = drafts.at(0);
  const shouldPrompt = ready && !hasPrompted && firstDraft !== undefined;

  useEffect(() => {
    if (!shouldPrompt) {
      return;
    }

    if (hasPromptedInSession()) {
      setHasPrompted(true);
      return;
    }

    const timer = window.setTimeout(() => {
      markPromptedInSession();
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
    const path =
      drafts.length === 1 ? ROUTES.REVIEWS.DRAFT(firstDraft.saveId) : ROUTES.REVIEWS.DRAFTS;
    router.push(withReviewReturnTo(path, returnTo));
  };

  return { isOpen, onOpenChange: setIsOpen, continueWriting };
}
