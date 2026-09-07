"use client";

import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import { TmtApiError } from "@/api/mutator";

const STALE_TIME_MS = 60_000;
const MAX_RETRY_COUNT = 2;
const HTTP_STATUS_BAD_GATEWAY = 502;

function shouldRetryQuery(failureCount: number, error: unknown) {
  if (failureCount >= MAX_RETRY_COUNT) {
    return false;
  }

  // 502는 상류(외부 주소 API 등)가 이미 불안정해 재시도가 상황을 악화시킬 수 있다.
  return !(
    error instanceof TmtApiError &&
    (error.httpStatus < 500 || error.httpStatus === HTTP_STATUS_BAD_GATEWAY)
  );
}

function createQueryClient() {
  const isServer = typeof window === "undefined";

  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME_MS,
        refetchOnWindowFocus: false,
        retry: isServer ? false : shouldRetryQuery,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(createQueryClient);

  return (
    <QueryClientProvider client={client}>
      <QueryErrorResetBoundary>{children}</QueryErrorResetBoundary>
    </QueryClientProvider>
  );
}
