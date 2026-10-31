import { ROUTES } from "@/shared/constants/routes";

/** 로그인 후 이동은 앱 내부 경로만 허용한다. URL·쿠키 값도 신뢰하지 않는다. */
export function safeReturnTo(value: unknown): string {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    Array.from(value).some((char) => char.charCodeAt(0) <= 32)
  )
    return ROUTES.ROOT;
  try {
    const url = new URL(value, "https://tmt.invalid");
    if (
      url.origin !== "https://tmt.invalid" ||
      /^\/(?:login|signup|onboarding|auth|api)(?:\/|$)/.test(url.pathname)
    )
      return ROUTES.ROOT;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return ROUTES.ROOT;
  }
}

/** 복귀 경로를 쿼리로 넘긴다. 읽는 쪽은 `safeReturnTo`를 거친다. */
export function pathWithReturnTo(path: string, returnTo: string): string {
  return `${path}?returnTo=${encodeURIComponent(safeReturnTo(returnTo))}`;
}

/** 로그인 화면의 `둘러보기` 목적지. 돌아갈 곳이 로그인 필수면 다시 로그인으로 튕기므로 홈으로 보낸다. */
export function getBrowseTarget(returnTo: string): string {
  const safe = safeReturnTo(returnTo);
  const { pathname } = new URL(safe, "https://tmt.invalid");
  return isPublicPage(pathname) ? safe : ROUTES.ROOT;
}

export function isPublicPage(pathname: string): boolean {
  return (
    pathname === ROUTES.ROOT ||
    pathname === ROUTES.FEED ||
    pathname === ROUTES.GROUPS.ROOT ||
    pathname === ROUTES.LOGIN ||
    pathname === "/auth/complete" ||
    pathname === "/preview" ||
    pathname.startsWith("/preview/") ||
    /^\/groups\/(?!new$)[^/]+$/.test(pathname) ||
    /^\/places\/[^/]+$/.test(pathname) ||
    /^\/profile\/(?!me(?:\/|$))[^/]+(?:\/(?:reviews|groups|favorites))?$/.test(pathname)
  );
}
