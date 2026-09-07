"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { ROUTES } from "@/shared/constants/routes";
import { withReviewReturnTo } from "@/shared/utils/reviewNavigation";

export function useReviewReturnTo(): string {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  return query.length > 0 ? `${pathname}?${query}` : pathname;
}

export function useReviewEntryPath(): string {
  return withReviewReturnTo(ROUTES.REVIEWS.NEW, useReviewReturnTo());
}
