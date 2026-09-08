"use client";

import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import { TmtApiError } from "@/api/mutator";

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
        // 화면에 들어오거나 탭으로 돌아올 때마다 서버를 다시 확인한다. 캐시는 그 사이를
        // 메워 화면을 즉시 그리는 용도지, 최신성을 미루는 용도가 아니다.
        staleTime: 0,
        refetchOnWindowFocus: true,
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
