"use client";

import { ReviewCard } from "@/shared/components/ReviewCard/ReviewCard";
import type { ResolvedPosition } from "@/shared/hooks/useResolvedPosition";
import { useFeedReviews } from "../_hooks/useFeedReviews";
import { FeedNotice } from "./FeedNotice";

/** 시안이 태그 2개 + `+N` 접힘 고정이라 값으로 둔다. */
const MAX_VISIBLE_TAGS = 2;

type FeedListViewProps = {
  position: ResolvedPosition | null;
};

/** 검색어·칩이 없을 때의 기본 목록 — 반경 1km 안의 리뷰 카드 (명세 §2-1). */
export function FeedListView({ position }: FeedListViewProps) {
  const { data: reviews, isPending, isError } = useFeedReviews(position);

  if (position === null || isPending) {
    return <FeedNotice title="게시물을 불러오는 중이에요." />;
  }

  if (isError) {
    return <FeedNotice title="게시물을 불러오지 못했어요." />;
  }

  if (!reviews || reviews.length === 0) {
    return (
      <FeedNotice title="근처에 올라온 리뷰가 없어요.">
        {position.isFallback
          ? "위치 권한이 없어 강남역 주변 1km를 보여드리고 있어요."
          : "내 위치에서 1km 안의 리뷰를 보여드려요."}
      </FeedNotice>
    );
  }

  return (
    <ul className="flex flex-1 flex-col gap-ds-4">
      {reviews.map((review) => (
        <li key={review.id}>
          <ReviewCard review={review} maxVisibleTags={MAX_VISIBLE_TAGS} />
        </li>
      ))}
    </ul>
  );
}
