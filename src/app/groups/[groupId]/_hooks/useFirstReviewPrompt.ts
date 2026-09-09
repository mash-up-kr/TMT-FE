"use client";

import { useEffect, useState } from "react";
import { SHEET_PROMPT_DELAY_MS } from "@/shared/constants/motion";

/**
 * 그룹 첫 리뷰 안내 시트의 열림 상태.
 *
 * 열림을 조회 결과에서 파생하지 않고 effect로 뒤늦게 켠다. 파생하면 목록이 캐시에 있을 때
 * 첫 렌더부터 열린 채로 그려져, 올라오는 동작 없이 이미 떠 있는 화면이 된다.
 *
 * 한 번 닫으면 그 방문 동안은 다시 뜨지 않는다. 마이페이지 이어쓰기 안내와 달리 접속당 한 번
 * 이라는 요구가 없어 세션에 남기지 않는다.
 */
export function useFirstReviewPrompt(shouldPrompt: boolean) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (!shouldPrompt || isDismissed) {
      return;
    }

    const timer = window.setTimeout(() => setIsOpen(true), SHEET_PROMPT_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [shouldPrompt, isDismissed]);

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);

    if (!open) {
      setIsDismissed(true);
    }
  };

  return { isOpen, onOpenChange };
}
