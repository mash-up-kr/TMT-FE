"use client";

import { ScreenLayout } from "@/shared/components/ScreenLayout";
import { TMTLogoHomeLink } from "@/shared/components/TMTLogoHomeLink";
import { useCurrentPosition } from "@/shared/hooks/useCurrentPosition";
import { GNB } from "@/shared/ui/GNB";
import { LoadingIcon } from "@/shared/ui/Icons";
import { useHomeFavorite } from "../_hooks/useHomeFavorite";
import { useHomeFeed } from "../_hooks/useHomeFeed";
import { useHomeSummary } from "../_hooks/useHomeSummary";
import { HomeView } from "./HomeView";

export function HomeScreen() {
  const { data, isPending, isError, refetch } = useHomeSummary();
  const hasGroups = (data?.myGroups.length ?? 0) > 0;
  const position = useCurrentPosition({ enabled: hasGroups });
  const feed = useHomeFeed(position);
  const favorite = useHomeFavorite(feed.data);

  const header = <GNB align="left" className="shrink-0" title={null} left={<TMTLogoHomeLink />} />;

  if (isPending) {
    return (
      <ScreenLayout header={header}>
        <output className="flex flex-1 items-center justify-center">
          <LoadingIcon className="animate-spin text-icon-tertiary" />
        </output>
      </ScreenLayout>
    );
  }

  if (isError) {
    return (
      <ScreenLayout header={header}>
        <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-ds-12">
          <p className="text-body-md-regular text-content-secondary">
            홈 정보를 불러오지 못했어요.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-body-md-bold text-content-interactive-primary"
          >
            다시 시도
          </button>
        </div>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout header={header}>
      <HomeView
        summary={data}
        position={position}
        feedIsPending={feed.isPending}
        feedIsError={feed.isError}
        reviews={favorite.reviews}
        favoriteAction={favorite.favoriteAction}
      />
    </ScreenLayout>
  );
}
