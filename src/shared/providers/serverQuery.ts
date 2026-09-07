import { QueryClient } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { cache } from "react";
import { MOCK_USER_ID, MOCK_USER_ID_COOKIE, USER_ID_HEADER } from "@/api/mutator";

const STALE_TIME_MS = 60_000;

export const getServerQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: STALE_TIME_MS,
          retry: false,
        },
      },
    }),
);

/** 인증 도입 시 이 함수만 실제 인증 cookie를 API 요청으로 전달하도록 바꾼다. */
export async function getServerRequestInit(): Promise<RequestInit> {
  const store = await cookies();
  const userId = store.get(MOCK_USER_ID_COOKIE)?.value ?? MOCK_USER_ID;

  return { headers: { [USER_ID_HEADER]: userId } };
}
