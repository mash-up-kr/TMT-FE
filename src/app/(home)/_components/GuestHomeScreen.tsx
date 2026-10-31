"use client";

import { useQueryClient } from "@tanstack/react-query";
import { getListGroupsQueryKey } from "@/api/gen/group/group.gen";
import { getNearbyReviewsQueryKey } from "@/api/gen/nearby/nearby.gen";
import { ReviewCard } from "@/shared/components/ReviewCard/ReviewCard";
import { ScreenLayout } from "@/shared/components/ScreenLayout";
import { TMTLogoHomeLink } from "@/shared/components/TMTLogoHomeLink";
import { invalidateCurrentPosition } from "@/shared/hooks/useCurrentPosition";
import { useResolvedPosition } from "@/shared/hooks/useResolvedPosition";
import { useReviewFavorites } from "@/shared/hooks/useReviewFavorites";
import { GNB } from "@/shared/ui/GNB";
import { RetryNotice } from "@/shared/ui/RetryNotice";
import { useGuestNearbyReviews, useGuestRecommendedGroups } from "../_hooks/useGuestHome";
import { HomeFeedSkeleton } from "./HomeFeed";
import { RecommendedGroupList } from "./RecommendedGroupList";

export function GuestHomeScreen() {
  const queryClient = useQueryClient();
  const groups = useGuestRecommendedGroups();

  // 좌표만 다시 재면 같은 칸에 있을 때 목록 키가 안 바뀐다. 좌표와 조회를 함께 무효화한다.
  const refresh = () =>
    Promise.all([
      invalidateCurrentPosition(queryClient),
      queryClient.invalidateQueries({ queryKey: getNearbyReviewsQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getListGroupsQueryKey() }),
    ]);

  return (
    <ScreenLayout
      header={<GNB align="left" className="shrink-0" title={null} left={<TMTLogoHomeLink />} />}
      onRefresh={refresh}
    >
      <main className="flex flex-1 flex-col">
        <h1 className="sr-only">또맛또 홈</h1>
        {/* 근처 리뷰가 없으면 영역째 사라지므로 간격을 요소가 아니라 컨테이너가 소유한다. */}
        <div className="flex min-h-0 flex-1 flex-col gap-ds-4 bg-surface-secondary">
          <GuestNearbyReviews />

          {groups.isError ? (
            <div className="bg-surface-primary">
              <RetryNotice
                message="추천 그룹을 불러오지 못했어요."
                onRetry={() => groups.refetch()}
              />
            </div>
          ) : (
            <RecommendedGroupList groups={groups.data ?? []} />
          )}
        </div>
      </main>
    </ScreenLayout>
  );
}

function GuestNearbyReviews() {
  const position = useResolvedPosition();
  const nearby = useGuestNearbyReviews(position);
  const { reviews, favoriteAction } = useReviewFavorites(nearby.data);

  // 좌표가 정해지기 전에는 쿼리가 꺼져 있어 isPending만으로 구분되지 않는다.
  if (position === null || nearby.isPending) {
    return <HomeFeedSkeleton />;
  }

  const label = position.isFallback ? "강남역 주변 리뷰" : "근처 리뷰";

  if (nearby.isError) {
    return (
      <section className="flex flex-col bg-surface-primary" aria-label={label}>
        <RetryNotice message="리뷰를 불러오지 못했어요." onRetry={() => nearby.refetch()} />
      </section>
    );
  }

  // 근처에 리뷰가 없으면 영역을 숨긴다. 첫 화면은 추천 그룹이 채운다.
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section aria-label={label} className="flex flex-col">
      <ul className="flex flex-col gap-ds-4">
        {reviews.map((review) => (
          <li key={review.id}>
            <ReviewCard review={review} favoriteAction={favoriteAction} />
          </li>
        ))}
      </ul>
    </section>
  );
}
