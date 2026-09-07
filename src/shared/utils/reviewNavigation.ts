import { safeReturnTo } from "./authNavigation";

export const REVIEW_RETURN_TO_PARAM = "returnTo";

type SearchParamsLike = Pick<URLSearchParams, "get">;

export function getReviewReturnTo(searchParams: SearchParamsLike | string): string {
  const value =
    typeof searchParams === "string"
      ? new URLSearchParams(searchParams).get(REVIEW_RETURN_TO_PARAM)
      : searchParams.get(REVIEW_RETURN_TO_PARAM);

  return safeReturnTo(value);
}

export function withReviewReturnTo(path: string, returnTo: string): string {
  const [pathname, query = ""] = path.split("?", 2);
  const params = new URLSearchParams(query);
  params.set(REVIEW_RETURN_TO_PARAM, safeReturnTo(returnTo));

  return `${pathname}?${params.toString()}`;
}
