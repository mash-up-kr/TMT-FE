"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { NEW_REVIEW_BASE_PATH } from "../_constants/steps";
import type { CompleteReviewStore } from "../_model/store";
import { useReviewDraft } from "../_stores/ReviewDraftProvider";
import { isReviewStoreComplete } from "../_utils/reviewStore";

export function useReviewDraftGuard(): CompleteReviewStore | null {
  const router = useRouter();
  const { store } = useReviewDraft();
  const completeStore = isReviewStoreComplete(store) ? store : null;
  const hasStore = completeStore !== null;

  useEffect(() => {
    if (!hasStore) {
      // push면 되돌아간 뒤 뒤로가기로 다시 이 단계에 와서 무한 왕복한다.
      router.replace(NEW_REVIEW_BASE_PATH);
    }
  }, [hasStore, router]);

  return completeStore;
}
