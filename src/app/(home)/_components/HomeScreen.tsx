"use client";

import { useAuth } from "@/shared/hooks/useAuth";
import { GuestHomeScreen } from "./GuestHomeScreen";
import { MemberHomeScreen } from "./MemberHomeScreen";

/** `/v1/home`은 로그인 전용이다. 조회 훅이 비로그인에게 실행되지 않도록 화면을 통째로 나눈다. */
export function HomeScreen() {
  const { state } = useAuth();

  return state.status === "authenticated" ? <MemberHomeScreen /> : <GuestHomeScreen />;
}
