"use client";

import { useEffect, useRef, useState } from "react";
export function useKakaoLogin(returnTo: string, callbackError: string | null) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const starting = useRef(false);

  useEffect(() => {
    const resume = () => {
      starting.current = false;
      setPending(false);
    };
    window.addEventListener("pageshow", resume);
    return () => window.removeEventListener("pageshow", resume);
  }, []);

  async function login() {
    if (starting.current) return;
    starting.current = true;
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/kakao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({ returnTo }),
        signal: AbortSignal.timeout(10_000),
      });
      const body: unknown = await response.json();
      if (
        !response.ok ||
        typeof body !== "object" ||
        body === null ||
        !("authorizationUrl" in body) ||
        typeof body.authorizationUrl !== "string"
      )
        throw new Error("로그인 준비 실패");
      const authorizationUrl = new URL(body.authorizationUrl);
      if (
        authorizationUrl.origin !== "https://kauth.kakao.com" ||
        authorizationUrl.pathname !== "/oauth/authorize" ||
        authorizationUrl.username ||
        authorizationUrl.password ||
        new URL(authorizationUrl.searchParams.get("redirect_uri") ?? "").origin !==
          window.location.origin
      )
        throw new Error("로그인 경로 오류");
      window.location.assign(authorizationUrl.href);
    } catch {
      starting.current = false;
      setPending(false);
      setError("로그인을 시작하지 못했어요. 잠시 후 다시 시도해 주세요.");
    }
  }

  const message =
    error ??
    (callbackError === "cancelled"
      ? "카카오 로그인을 취소했어요. 다시 시작할 수 있어요."
      : callbackError
        ? "로그인을 완료하지 못했어요. 다시 시도해 주세요."
        : null);

  return { pending, error: message, login };
}
