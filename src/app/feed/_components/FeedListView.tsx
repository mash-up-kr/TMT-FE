"use client";

import emptyMascot from "@/shared/components/assets/mascot-empty.png";

import { ReviewCard } from "@/shared/components/ReviewCard/ReviewCard";
import type { ResolvedPosition } from "@/shared/hooks/useResolvedPosition";
import { Skeleton } from "@/shared/ui/Skeleton";
import { useFeedReviews } from "../_hooks/useFeedReviews";
import { FeedNotice } from "./FeedNotice";

/** 시안이 태그 2개 + `+N` 접힘 고정이라 값으로 둔다. */
const MAX_VISIBLE_TAGS = 2;

const SKELETON_CARDS = [0, 1];

type FeedListViewProps = {
  position: ResolvedPosition | null;
};

/** 검색어·칩이 없을 때의 기본 목록 — 반경 1km 안의 리뷰 카드 (명세 §2-1). */
export function FeedListView({ position }: FeedListViewProps) {
  const { data: reviews, isPending, isError } = useFeedReviews(position);
  // 로딩 중에도 자리와 배경을 잡아야 한다. 비워두면 뒤 회색이 비쳤다가 흰 콘텐츠로 바뀐다.
  if (position === null || isPending) {
    return <FeedListSkeleton />;
  }

  if (isError) {
    return <FeedNotice src={emptyMascot} title="게시물을 불러오지 못했어요." />;
  }

  if (!reviews || reviews.length === 0) {
    return (
      <FeedNotice src={emptyMascot} title="근처에 올라온 리뷰가 없어요.">
        {position.isFallback
          ? "위치 권한이 없어 강남역 주변 1km를 보여드리고 있어요."
          : "내 위치에서 1km 안의 리뷰를 보여드려요."}
      </FeedNotice>
    );
  }

  return (
    <ul className="scroll-under-navigation flex flex-1 flex-col gap-ds-4">
      {reviews.map((review) => (
        <li key={review.id}>
          <ReviewCard review={review} maxVisibleTags={MAX_VISIBLE_TAGS} />
        </li>
      ))}
    </ul>
  );
}

/** ReviewCard 형태를 흉내낸다 — 헤더(아바타+텍스트) → 사진 → 본문. */
function FeedListSkeleton() {
  return (
    <ul aria-busy="true" className="scroll-under-navigation flex flex-1 flex-col gap-ds-4">
      {SKELETON_CARDS.map((card) => (
        <li key={card}>
          <article className="flex flex-col bg-surface-primary">
            <div className="flex items-center gap-ds-8 px-ds-12 pt-ds-16 pb-ds-8">
              <Skeleton className="size-ds-40 shrink-0 rounded-ds-full" />
              <div className="flex min-w-0 flex-1 flex-col gap-ds-4">
                <Skeleton className="h-ds-20 w-ds-64" />
                <Skeleton className="h-ds-12 w-ds-32" />
              </div>
            </div>
            <Skeleton className="h-[360px] w-full rounded-none" />
            <div className="flex flex-col gap-ds-12 p-ds-16">
              <Skeleton className="h-ds-20 w-full" />
              <Skeleton className="h-ds-20 w-2/3" />
              <Skeleton className="h-ds-32 w-full" />
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
