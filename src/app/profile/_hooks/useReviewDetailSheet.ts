"use client";

import { useState } from "react";
import { useReviewDetail } from "@/api/gen/review-detail/review-detail.gen";
import type { ReviewDetail } from "@/shared/components/ReviewDetailSheet/ReviewDetailSheet";
import type { ProfileReviewItem } from "../_model/profile";
import { toReviewDetail } from "../_utils/profileMappers";

/** 시트는 항상 상세를 요구한다. 아직 못 받은 동안 채워 넣을 빈 값이다. */
const EMPTY: ReviewDetail = {
  placeName: "",
  address: null,
  categoryName: null,
  rating: null,
  tags: [],
  photos: [],
  pros: null,
  cons: null,
  content: null,
};

export function useReviewDetailSheet() {
  const [selected, setSelected] = useState<ProfileReviewItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const detail = useReviewDetail<ReviewDetail>(selected?.reviewId ?? "", {
    query: { enabled: selected !== null, select: toReviewDetail },
  });

  return {
    isOpen,
    // 응답이 오기 전에도 시트는 열린다. 매장 이름만 먼저 채워 빈 시트로 보이지 않게 한다.
    detail: detail.data ?? (selected ? { ...EMPTY, placeName: selected.placeName } : EMPTY),
    open: (review: ProfileReviewItem) => {
      setSelected(review);
      setIsOpen(true);
    },
    onOpenChange: setIsOpen,
  };
}
