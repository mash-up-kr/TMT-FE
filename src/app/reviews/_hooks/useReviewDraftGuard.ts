"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { getReviewReturnTo, withReviewReturnTo } from "@/shared/utils/reviewNavigation";
import { NEW_REVIEW_BASE_PATH } from "../_constants/steps";
import type { CompleteReviewStore } from "../_model/store";
import { useReviewDraft } from "../_stores/ReviewDraftProvider";
import { isReviewStoreComplete } from "../_utils/reviewStore";

export function useReviewDraftGuard(): CompleteReviewStore | null {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = getReviewReturnTo(searchParams);
  const { store } = useReviewDraft();
  const completeStore = isReviewStoreComplete(store) ? store : null;
  const hasStore = completeStore !== null;

  useEffect(() => {
    if (!hasStore) {
      // push면 되돌아간 뒤 뒤로가기로 다시 이 단계에 와서 무한 왕복한다.
      router.replace(withReviewReturnTo(NEW_REVIEW_BASE_PATH, returnTo));
    }
  }, [hasStore, router, returnTo]);

  return completeStore;
}
