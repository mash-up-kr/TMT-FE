"use client";

import { createContext, type ReactNode, useContext } from "react";

type ReviewFlowBaseContextValue = {
  basePath: string;
  saveId: string | null;
};

const ReviewFlowBaseContext = createContext<ReviewFlowBaseContextValue | null>(null);

export function ReviewFlowBaseProvider({
  basePath,
  saveId = null,
  children,
}: Readonly<{ basePath: string; saveId?: string | null; children: ReactNode }>) {
  return (
    <ReviewFlowBaseContext.Provider value={{ basePath, saveId }}>
      {children}
    </ReviewFlowBaseContext.Provider>
  );
}

export function useReviewFlowBase() {
  const value = useContext(ReviewFlowBaseContext);

  if (value === null) {
    throw new Error("useReviewFlowBase는 ReviewFlowBaseProvider 안에서만 쓸 수 있다.");
  }

  return value.basePath;
}

export function useReviewFlowSaveId() {
  const value = useContext(ReviewFlowBaseContext);

  if (value === null) {
    throw new Error("useReviewFlowSaveId는 ReviewFlowBaseProvider 안에서만 쓸 수 있다.");
  }

  return value.saveId;
}
