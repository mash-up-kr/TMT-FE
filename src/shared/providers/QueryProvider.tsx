"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import { TmtApiError } from "@/api/mutator";

const STALE_TIME_MS = 60_000;
const MAX_RETRY_COUNT = 2;

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME_MS,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (error instanceof TmtApiError && error.httpStatus < 500) {
            return false;
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
