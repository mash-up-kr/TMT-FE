"use client";

import { useQueryClient } from "@tanstack/react-query";
import { getFeedQueryKey, getHomeQueryKey } from "@/api/gen/home/home.gen";
import { ScreenLayout } from "@/shared/components/ScreenLayout";
import { TMTLogoHomeLink } from "@/shared/components/TMTLogoHomeLink";
import { invalidateCurrentPosition, useCurrentPosition } from "@/shared/hooks/useCurrentPosition";
import { GNB } from "@/shared/ui/GNB";
import { useHomeFavorite } from "../_hooks/useHomeFavorite";
import { useHomeFeed } from "../_hooks/useHomeFeed";
import { useSuspenseHomeSummary } from "../_hooks/useHomeSummary";
import { HomeView } from "./HomeView";

export function HomeScreen() {
  const queryClient = useQueryClient();
  const { data } = useSuspenseHomeSummary();
  const hasGroups = data.myGroups.length > 0;
  const position = useCurrentPosition({ enabled: hasGroups });
  const feed = useHomeFeed(position);
  const favorite = useHomeFavorite(feed.data);

  // 좌표만 다시 재면 같은 칸에 있을 때 목록 키가 안 바뀐다. 좌표와 조회를 함께 무효화한다.
  const refresh = () =>
    Promise.all([
      invalidateCurrentPosition(queryClient),
      queryClient.invalidateQueries({ queryKey: getHomeQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getFeedQueryKey() }),
    ]);

  return (
    <ScreenLayout
      header={<GNB align="left" className="shrink-0" title={null} left={<TMTLogoHomeLink />} />}
      onRefresh={refresh}
    >
      <HomeView
        summary={data}
        position={position}
        feedIsPending={feed.isPending}
        feedIsError={feed.isError}
        onFeedRetry={() => feed.refetch()}
        reviews={favorite.reviews}
        favoriteAction={favorite.favoriteAction}
      />
    </ScreenLayout>
  );
}
