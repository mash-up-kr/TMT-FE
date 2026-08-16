"use client";

import { createContext, type ReactNode, useContext, useMemo, useState } from "react";
import type { ReviewStore } from "../_model/store";

type ReviewDraftContextValue = {
  store: ReviewStore | null;
  setStore: (store: ReviewStore | null) => void;
};

const ReviewDraftContext = createContext<ReviewDraftContextValue | null>(null);

/**
 * 단계 라우트가 갈려도 layout은 리마운트되지 않는다. 초안을 여기에 두면
 * 뒤로가기로 이전 단계에 돌아가도 입력이 남는다(시안 주석 요구사항).
 */
export function ReviewDraftProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [store, setStore] = useState<ReviewStore | null>(null);
  const value = useMemo(() => ({ store, setStore }), [store]);

  return <ReviewDraftContext.Provider value={value}>{children}</ReviewDraftContext.Provider>;
}

export function useReviewDraft() {
  const value = useContext(ReviewDraftContext);

  if (value === null) {
    throw new Error("useReviewDraft는 ReviewDraftProvider 안에서만 쓸 수 있다.");
  }

  return value;
}
