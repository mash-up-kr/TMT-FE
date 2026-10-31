"use client";

import { useEffect, useState } from "react";
import { SHEET_PROMPT_DELAY_MS } from "@/shared/constants/motion";
import { useAuth } from "@/shared/hooks/useAuth";
import { TICKET_ONBOARDING_STORAGE_KEY } from "../_constants/ticketOnboarding";

type PromptStorage = "localStorage" | "sessionStorage";

function hasSeenTicketOnboarding(storage: PromptStorage): boolean {
  try {
    return window[storage].getItem(TICKET_ONBOARDING_STORAGE_KEY) === "true";
  } catch {
    // 저장소가 막힌 환경에서는 기억하지 못한다. 안내가 다시 뜰 뿐 화면은 정상 동작한다.
    return false;
  }
}

function markTicketOnboardingSeen(storage: PromptStorage): void {
  try {
    window[storage].setItem(TICKET_ONBOARDING_STORAGE_KEY, "true");
  } catch {
    // 위와 같다.
  }
}

/**
 * 그룹 탭 첫 진입에 티켓 안내 시트를 올린다. 로그인 사용자는 **기기당 한 번만** 띄우고 (TMT-435),
 * 비로그인은 탭 세션당 한 번 띄운다. 두 기록은 따로라, 비로그인 때 봤어도 로그인 후 한 번 더 뜬다.
 *
 * 띄운 순간 본 것으로 기록한다. 끝까지 넘기지 않고 닫아도 다시 띄우지 않는다.
 *
 * 저장소는 mount 뒤 effect에서 읽는다. 초기 state에서 읽으면 서버 렌더와 첫 클라이언트 렌더가
 * 어긋나 hydration이 깨진다.
 */
export function useTicketOnboardingPrompt() {
  const { state } = useAuth();
  // 비로그인은 다음 방문에 다시 안내하도록 탭 세션 동안만 기억한다.
  const storage = state.status === "authenticated" ? "localStorage" : "sessionStorage";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hasSeenTicketOnboarding(storage)) {
      return;
    }

    const timer = window.setTimeout(() => {
      markTicketOnboardingSeen(storage);
      setOpen(true);
    }, SHEET_PROMPT_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [storage]);

  return { open, onOpenChange: setOpen };
}
