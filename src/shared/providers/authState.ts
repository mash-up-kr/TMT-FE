import type { SessionStatus } from "@/api/auth-session";
import { getTmtApiErrorCode, TmtApiError } from "@/api/mutator";

export type AuthState =
  | { status: "restoring-session" }
  | { status: "anonymous" }
  | { status: "checking-profile" }
  | { status: "signup-required" }
  | { status: "authenticated" }
  | { status: "account-not-found" }
  | { status: "logging-out" }
  | { status: "error"; source: "session" | "profile" | "logout" };

type ProfileQueryState = {
  data: boolean | undefined;
  isError: boolean;
  error: unknown;
};

/** 세션과 내 프로필 조회 결과를 화면에서 사용할 하나의 상태로 해석한다. */
export function getAuthState(sessionStatus: SessionStatus, profile: ProfileQueryState): AuthState {
  switch (sessionStatus) {
    case "loading":
      return { status: "restoring-session" };
    case "anonymous":
    case "logging-out":
      return { status: sessionStatus };
    case "error":
      return { status: "error", source: "session" };
    case "logout-error":
      return { status: "error", source: "logout" };
    case "authenticated":
      // 계정 없음은 이전 가입 상태보다 우선한다. 이 함수에는 내 프로필 쿼리만 전달한다.
      if (
        profile.isError &&
        profile.error instanceof TmtApiError &&
        profile.error.httpStatus === 404 &&
        getTmtApiErrorCode(profile.error) === "USER_NOT_FOUND"
      ) {
        return { status: "account-not-found" };
      }

      // 재조회가 실패해도 이미 확인한 상태는 유지해 작성 중인 화면을 보존한다.
      if (profile.data === true) return { status: "authenticated" };
      if (profile.data === false) return { status: "signup-required" };
      if (profile.isError) return { status: "error", source: "profile" };
      return { status: "checking-profile" };
  }
}
