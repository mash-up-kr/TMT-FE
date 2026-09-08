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
      /^\/(?:login|signup|auth|api)(?:\/|$)/.test(url.pathname)
    )
      return ROUTES.ROOT;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return ROUTES.ROOT;
  }
}

export function isPublicPage(pathname: string): boolean {
  return (
    pathname === ROUTES.LOGIN ||
    pathname === "/auth/complete" ||
    pathname === "/preview" ||
    pathname.startsWith("/preview/") ||
    /^\/profile\/(?!me(?:\/|$))[^/]+(?:\/(?:reviews|groups|favorites))?$/.test(pathname)
  );
}
