"use client";

import { createContext, type ReactNode, useContext } from "react";

const ReviewFlowBaseContext = createContext<string | null>(null);

/**
 * 이 플로우가 어느 기준 경로 위에서 도는지 알린다.
 *
 * 단계 페이지는 layout에서 props를 받을 수 없어 기준 경로를 직접 import하게 되는데, 그러면
 * 페이지마다 자기가 어느 트리(새 리뷰 / 이어쓰기)에 속하는지 알게 된다. 트리별 layout이 값을
 * 심어주고 아래에서는 읽기만 하면, 같은 단계 코드가 두 트리에서 그대로 돌아간다.
 */
export function ReviewFlowBaseProvider({
  basePath,
  children,
}: Readonly<{ basePath: string; children: ReactNode }>) {
  return (
    <ReviewFlowBaseContext.Provider value={basePath}>{children}</ReviewFlowBaseContext.Provider>
  );
}

export function useReviewFlowBase() {
  const basePath = useContext(ReviewFlowBaseContext);

  if (basePath === null) {
    throw new Error("useReviewFlowBase는 ReviewFlowBaseProvider 안에서만 쓸 수 있다.");
  }

  return basePath;
}
