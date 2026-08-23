"use client";

import { createContext, type ReactNode, useContext } from "react";

const ReviewFlowBaseContext = createContext<string | null>(null);

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
