"use client";

import { useMe } from "@/api/gen/profile/profile.gen";
import { useAuth } from "@/shared/hooks/useAuth";

/**
 * 타인 프로필 경로가 사실은 내 계정인지 알려준다.
 *
 * `AuthProvider`가 같은 키로 내 프로필을 이미 받아두므로 요청이 늘지 않는다. 다만 그쪽은
 * 세션이 있을 때만 조회하므로 여기서도 같은 조건을 건다. 걸지 않으면 비로그인 방문자가
 * 공개 프로필을 볼 때 `/v1/users/me`가 401로 나간다.
 *
 * 세션이 없으면 판별할 것도 없어 `false`다 — 비로그인은 타인 프로필만 본다.
 */
export function useIsMyProfile(userId: string): boolean {
  const { state } = useAuth();
  const myUserId = useMe<string>({
    query: {
      enabled: state.status === "authenticated",
      select: (profile) => profile.userId,
    },
  });

  return myUserId.data === userId;
}
