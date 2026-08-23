"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import { TmtApiError } from "@/api/mutator";

const STALE_TIME_MS = 60_000;
const MAX_RETRY_COUNT = 2;
const HTTP_STATUS_BAD_GATEWAY = 502;

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME_MS,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (error instanceof TmtApiError) {
            if (error.httpStatus < 500) {
              return false;
            }
            // 502는 상류(외부 주소 API 등)가 이미 불안정하다는 뜻이라 재시도가 상황을 악화시킨다.
            if (error.httpStatus === HTTP_STATUS_BAD_GATEWAY) {
              return false;
            }
          }
          return failureCount < MAX_RETRY_COUNT;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(createQueryClient);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
