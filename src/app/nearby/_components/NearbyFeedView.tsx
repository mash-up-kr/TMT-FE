"use client";

import { ReviewCard } from "@/shared/components/ReviewCard/ReviewCard";
import type { ResolvedPosition } from "@/shared/hooks/useResolvedPosition";
import { useNearbyFeed } from "../_hooks/useNearbyFeed";
import { NearbyNotice } from "./NearbyNotice";

/** 시안이 태그 2개 + `+N` 접힘 고정이라 값으로 둔다. */
const MAX_VISIBLE_TAGS = 2;

type NearbyFeedViewProps = {
  position: ResolvedPosition | null;
};

/** 검색어·칩이 없을 때의 기본 목록 — 반경 1km 안의 리뷰 카드 (명세 §2-1). */
export function NearbyFeedView({ position }: NearbyFeedViewProps) {
  const { data: reviews, isPending, isError } = useNearbyFeed(position);

  if (position === null || isPending) {
    return <NearbyNotice title="게시물을 불러오는 중이에요." />;
  }

  if (isError) {
    return <NearbyNotice title="게시물을 불러오지 못했어요." />;
  }

  if (!reviews || reviews.length === 0) {
    return (
      <NearbyNotice title="근처에 올라온 리뷰가 없어요.">
        {position.isFallback
          ? "위치 권한이 없어 강남역 주변 1km를 보여드리고 있어요."
          : "내 위치에서 1km 안의 리뷰를 보여드려요."}
      </NearbyNotice>
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
