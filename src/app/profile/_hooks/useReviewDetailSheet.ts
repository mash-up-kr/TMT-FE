"use client";

import { useState } from "react";
import type { ReviewDetail } from "@/shared/components/ReviewDetailSheet/ReviewDetailSheet";
import { toReviewDetailFixture } from "../_fixtures/reviewDetailFixture";
import type { ProfileReviewItem } from "../_model/profile";

/**
 * 리뷰 그리드에서 여는 상세 바텀시트의 열림 상태.
 *
 * 상세 응답은 아직 계약 밖(F·G·I 명세)이라 fixture로 채운다.
 * 연동 시 `detail`을 상세 query 결과로 바꾸면 나머지는 그대로다.
 */
export function useReviewDetailSheet() {
  const [selected, setSelected] = useState<ProfileReviewItem | null>(null);

  return {
    isOpen: selected !== null,
    detail: toReviewDetailFixture(selected) satisfies ReviewDetail,
    open: (review: ProfileReviewItem) => setSelected(review),
    onOpenChange: (next: boolean) => {
      if (!next) {
        setSelected(null);
      }
    },
  };
}
