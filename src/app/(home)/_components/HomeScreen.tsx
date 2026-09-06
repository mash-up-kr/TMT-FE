"use client";

import { ScreenLayout } from "@/shared/components/ScreenLayout";
import { TMTLogoHomeLink } from "@/shared/components/TMTLogoHomeLink";
import { useCurrentPosition } from "@/shared/hooks/useCurrentPosition";
import { GNB } from "@/shared/ui/GNB";
import { useHomeFavorite } from "../_hooks/useHomeFavorite";
import { useHomeFeed } from "../_hooks/useHomeFeed";
import { useSuspenseHomeSummary } from "../_hooks/useHomeSummary";
import { HomeView } from "./HomeView";

export function HomeScreen() {
  const { data } = useSuspenseHomeSummary();
  const hasGroups = data.myGroups.length > 0;
  const position = useCurrentPosition({ enabled: hasGroups });
  const feed = useHomeFeed(position);
  const favorite = useHomeFavorite(feed.data);

  return (
    <ScreenLayout
      header={<GNB align="left" className="shrink-0" title={null} left={<TMTLogoHomeLink />} />}
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
