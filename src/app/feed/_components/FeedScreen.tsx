"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getNearbyReviewsQueryKey } from "@/api/gen/nearby/nearby.gen";
import { getSearchPlacesQueryKey } from "@/api/gen/place/place.gen";
import { ScreenLayout } from "@/shared/components/ScreenLayout";
import { TMTLogoHomeLink } from "@/shared/components/TMTLogoHomeLink";
import { invalidateCurrentPosition } from "@/shared/hooks/useCurrentPosition";
import { useResolvedPosition } from "@/shared/hooks/useResolvedPosition";
import { FloatingActionButton } from "@/shared/ui/FloatingActionButton";
import { GNB } from "@/shared/ui/GNB";
import { FeedIcon, MapIcon } from "@/shared/ui/Icons";
import { RefreshableScrollArea } from "@/shared/ui/RefreshableScrollArea";
import { SearchField } from "@/shared/ui/TextField";
import { useFeedScroll } from "../_hooks/useFeedScroll";
import { useFeedSearch } from "../_hooks/useFeedSearch";
import { FeedCurationChips } from "./FeedCurationChips";
import { FeedListView } from "./FeedListView";
import { FeedMapView } from "./FeedMapView";
import { FeedSearchResults } from "./FeedSearchResults";

type FeedView = "feed" | "map";

export function FeedScreen() {
  const queryClient = useQueryClient();
  const position = useResolvedPosition();
  const [view, setView] = useState<FeedView>("feed");
  const search = useFeedSearch();
  const { query, curationTagId } = search;
  const bodyRef = useFeedScroll({ query, curationTagId, enabled: view === "feed" });

  const searchBar = (
    <SearchField
      value={search.value}
      onValueChange={search.changeSearch}
      onCompositionStart={search.startComposition}
      onCompositionEnd={search.endComposition}
      placeholder="장소나 태그로 검색해보세요"
      aria-label="장소나 태그 검색"
    />
  );

  // 좌표만 다시 재면 같은 칸에 있을 때 목록 키가 안 바뀐다. 좌표와 조회를 함께 무효화한다.
  function refresh() {
    return Promise.all([
      invalidateCurrentPosition(queryClient),
      queryClient.invalidateQueries({ queryKey: getNearbyReviewsQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getSearchPlacesQueryKey() }),
    ]);
  }

  return (
    <ScreenLayout
      bodyScrollable={false}
      header={<GNB align="left" className="shrink-0" title={null} left={<TMTLogoHomeLink />} />}
      floating={
        <ViewSwitchButton
          view={view}
          onToggle={() => setView((prev) => (prev === "feed" ? "map" : "feed"))}
        />
      }
    >
      {view === "feed" ? (
        <>
          <div className="flex shrink-0 flex-col gap-ds-12 bg-surface-primary px-ds-20 py-ds-12">
            {searchBar}
            <FeedCurationChips
              selectedId={curationTagId}
              onSelect={search.selectCuration}
              className="flex-nowrap overflow-x-auto"
            />
          </div>
          <RefreshableScrollArea ref={bodyRef} onRefresh={refresh}>
            <div className="flex min-h-full shrink-0 flex-col bg-surface-secondary">
              {query || curationTagId ? (
                <FeedSearchResults
                  position={position}
                  query={query}
                  curationTagId={curationTagId}
                />
              ) : (
                <FeedListView position={position} />
              )}
            </div>
          </RefreshableScrollArea>
        </>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col bg-surface-secondary">
          <FeedMapView
            position={position}
            query={query}
            curationTagId={curationTagId}
            onCurationSelect={search.selectCuration}
            searchBar={searchBar}
          />
        </div>
      )}
    </ScreenLayout>
  );
}

type ViewSwitchButtonProps = {
  view: FeedView;
  onToggle: () => void;
};

/** 피드 ↔ 지도 전환. 시안이 FAB 하나로 양방향을 처리한다. */
function ViewSwitchButton({ view, onToggle }: ViewSwitchButtonProps) {
  const isFeed = view === "feed";

  return (
    <FloatingActionButton
      placement="floating"
      onClick={onToggle}
      aria-label={isFeed ? "지도로 보기" : "피드로 보기"}
    >
      {isFeed ? <MapIcon size={24} /> : <FeedIcon filled size={24} />}
    </FloatingActionButton>
  );
}
