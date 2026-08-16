"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { REVIEW_FLOW_BASE_PATH, REVIEW_STEPS } from "../_constants/steps";
import { useReviewDraft } from "../_stores/ReviewDraftProvider";
import { isReviewStoreComplete } from "../_utils/reviewStore";

const FIRST_STEP_PATH = `${REVIEW_FLOW_BASE_PATH}/${REVIEW_STEPS[0].segment}`;

/**
 * 초안 없이 열린 단계를 1단계로 돌려보낸다.
 *
 * 초안은 layout의 메모리에만 있어서 새로고침이나 딥링크로 2단계 이후를 열면 매장이 비어 있다.
 * 그대로 두면 매장 없는 리뷰를 계속 작성하게 되므로 첫 단계로 되돌린다.
 *
 * 임시 저장으로 복원하지 않는 것은 시안 제약이다 — 이탈 모달이 "모두 삭제돼요"라고 단언한다.
 * 저장 여부는 아직 합의되지 않았고, 저장을 도입하더라도 이 가드는 그대로 필요하다.
 * (docs/review-write-flow-implementation.md §9.1)
 *
 * `replace`를 쓰는 이유: 되돌아간 뒤 뒤로가기를 누르면 다시 이 단계로 와서 무한 왕복이 된다.
 */
export function useReviewDraftGuard() {
  const router = useRouter();
  const { store } = useReviewDraft();
  const hasStore = isReviewStoreComplete(store) || process.env.NODE_ENV === "development";

  useEffect(() => {
    if (!hasStore) {
      router.replace(FIRST_STEP_PATH);
    }
  }, [hasStore, router]);

  return hasStore;
}
