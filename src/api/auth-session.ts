import { TmtApiError } from "./error";

export type SessionStatus =
  | "loading"
  | "authenticated"
  | "anonymous"
  | "error"
  | "logging-out"
  | "logout-error";
type SessionSnapshot = Readonly<{ status: SessionStatus; revision: number }>;

const initialSnapshot: SessionSnapshot = { status: "loading", revision: 0 };
let snapshot = initialSnapshot;
let accessToken: string | null = null;
let generation = 0;
let refreshPromise: Promise<string> | null = null;
let logoutPromise: Promise<void> | null = null;
let channel: BroadcastChannel | null = null;
const listeners = new Set<() => void>();

function publish(status: SessionStatus, reset = false) {
  snapshot = { status, revision: snapshot.revision + (reset ? 1 : 0) };
  for (const listener of listeners) listener();
}

function clearMemory() {
  generation += 1;
  accessToken = null;
  publish("anonymous", true);
}

// 쿠키를 바꾸는 요청을 탭 사이에서도 순서대로 처리한다. 지원하지 않는 브라우저는 탭 내에서만 묶인다.
async function withCookieLock<T>(action: () => Promise<T>): Promise<T> {
  return typeof navigator !== "undefined" && navigator.locks
    ? navigator.locks.request("tmt-auth-cookie", action)
    : action();
}

async function postSession(path: string): Promise<unknown> {
  const response = await fetch(path, {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  const body: unknown = await response.json();
  if (!response.ok)
    throw new TmtApiError("로그인 상태를 확인하지 못했어요.", response.status, body);
  return body;
}

export function getAccessToken(): string | null {
  return typeof window === "undefined" ? null : accessToken;
}

export function getSessionSnapshot(): SessionSnapshot {
  return snapshot;
}

export function getServerSessionSnapshot(): SessionSnapshot {
  return initialSnapshot;
}

export function subscribeSession(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function refreshSession(): Promise<string> {
  if (typeof window === "undefined")
    return Promise.reject(new Error("브라우저 세션이 필요합니다."));
  if (logoutPromise) return Promise.reject(new Error("로그아웃 중입니다."));
  if (refreshPromise) return refreshPromise;

  const startedGeneration = generation;
  if (!accessToken) publish("loading");
  refreshPromise = withCookieLock(async () => {
    if (startedGeneration !== generation) throw new Error("세션이 변경되었습니다.");
    const body = await postSession("/api/auth/refresh");
    if (
      typeof body !== "object" ||
      body === null ||
      !("accessToken" in body) ||
      typeof body.accessToken !== "string" ||
      !body.accessToken ||
      !("accessTokenExpiresIn" in body) ||
      typeof body.accessTokenExpiresIn !== "number" ||
      !Number.isFinite(body.accessTokenExpiresIn) ||
      body.accessTokenExpiresIn <= 0
    )
      throw new Error("인증 응답이 올바르지 않습니다.");
    if (startedGeneration !== generation) throw new Error("세션이 변경되었습니다.");
    accessToken = body.accessToken;
    publish("authenticated");
    return accessToken;
  })
    .catch((error: unknown) => {
      if (startedGeneration === generation) {
        if (error instanceof TmtApiError && error.httpStatus === 401) {
          clearMemory();
        } else if (!accessToken) {
          publish("error");
        }
      }
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

export function logoutSession(): Promise<void> {
  if (logoutPromise) return logoutPromise;
  clearMemory();
  publish("logging-out");
  channel?.postMessage("logout");
  // 진행 중인 재발급의 Set-Cookie보다 로그아웃 삭제 응답이 뒤에 도착하도록 기다린다.
  const pendingRefresh = refreshPromise;
  logoutPromise = (async () => {
    await pendingRefresh?.catch(() => undefined);
    await withCookieLock(async () => {
      await postSession("/api/auth/logout");
      // 시작 알림 뒤에 열린 탭도 정리한다. 다음 쿠키 작업 전에 완료를 전파한다.
      channel?.postMessage("logout");
    });
    publish("anonymous");
  })()
    .catch((error: unknown) => {
      publish("logout-error");
      throw error;
    })
    .finally(() => {
      logoutPromise = null;
    });
  return logoutPromise;
}

export function connectSessionChannel() {
  if (typeof BroadcastChannel === "undefined") return () => undefined;
  const connection = new BroadcastChannel("tmt-auth");
  channel = connection;
  connection.onmessage = (event: MessageEvent<unknown>) => {
    if (event.data === "logout") clearMemory();
    if (event.data === "login") {
      clearMemory();
      void (refreshPromise ?? Promise.resolve())
        .catch(() => undefined)
        .then(() => refreshSession())
        .catch(() => undefined);
    }
  };
  return () => {
    connection.close();
    if (channel === connection) channel = null;
  };
}

export function announceLogin() {
  channel?.postMessage("login");
}
