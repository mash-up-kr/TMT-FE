"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { REVIEW_STEPS, reviewStepPath } from "../_constants/steps";
import type { CompleteReviewStore } from "../_model/store";
import { useReviewDraft } from "../_stores/ReviewDraftProvider";
import { useReviewFlowBase } from "../_stores/ReviewFlowBaseProvider";
import { isReviewStoreComplete } from "../_utils/reviewStore";

export function useReviewDraftGuard(): CompleteReviewStore | null {
  const router = useRouter();
  const basePath = useReviewFlowBase();
  const { store } = useReviewDraft();
  const completeStore = isReviewStoreComplete(store) ? store : null;
  const hasStore = completeStore !== null;

  useEffect(() => {
    if (!hasStore) {
      // push면 되돌아간 뒤 뒤로가기로 다시 이 단계에 와서 무한 왕복한다.
      router.replace(reviewStepPath(basePath, REVIEW_STEPS[0]));
    }
  }, [hasStore, router, basePath]);

  return completeStore;
}
