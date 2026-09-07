"use client";

import { createContext, type ReactNode, useContext } from "react";

type ReviewFlowBaseContextValue = {
  basePath: string;
  saveId: string | null;
  returnTo: string;
};

const ReviewFlowBaseContext = createContext<ReviewFlowBaseContextValue | null>(null);

export function ReviewFlowBaseProvider({
  basePath,
  saveId = null,
  returnTo,
  children,
}: Readonly<{
  basePath: string;
  saveId?: string | null;
  returnTo: string;
  children: ReactNode;
}>) {
  return (
    <ReviewFlowBaseContext.Provider value={{ basePath, saveId, returnTo }}>
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

export function useReviewFlowReturnTo() {
  const value = useContext(ReviewFlowBaseContext);

  if (value === null) {
    throw new Error("useReviewFlowReturnTo는 ReviewFlowBaseProvider 안에서만 쓸 수 있다.");
  }

  return value.returnTo;
}
