"use client";

import { useState } from "react";
import type { ReviewDetail } from "@/shared/components/ReviewDetailSheet/ReviewDetailSheet";
import { toReviewDetailFixture } from "../_fixtures/reviewDetailFixture";
import type { ProfileReviewItem } from "../_model/profile";

/** 상세 응답은 아직 계약 밖이라 fixture로 채운다. 연동 시 `detail`만 query 결과로 바꾼다. */
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
