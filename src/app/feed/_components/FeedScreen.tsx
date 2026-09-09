"use client";

import { useQueryClient } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { getNearbyReviewsQueryKey } from "@/api/gen/nearby/nearby.gen";
import { getSearchPlacesQueryKey } from "@/api/gen/place/place.gen";
import { ScreenLayout } from "@/shared/components/ScreenLayout";
import { TMTLogoHomeLink } from "@/shared/components/TMTLogoHomeLink";
import { invalidateCurrentPosition } from "@/shared/hooks/useCurrentPosition";
import { type ResolvedPosition, useResolvedPosition } from "@/shared/hooks/useResolvedPosition";
import { GNB } from "@/shared/ui/GNB";
import { FeedIcon, MapIcon } from "@/shared/ui/Icons";
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
  const refresh = () =>
    Promise.all([
      invalidateCurrentPosition(queryClient),
      queryClient.invalidateQueries({ queryKey: getNearbyReviewsQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getSearchPlacesQueryKey() }),
    ]);

  return (
    <ScreenLayout
      bodyScrollable={view === "feed"}
      bodyBottomInset={false}
      bodyRef={bodyRef}
      onRefresh={refresh}
      header={<GNB align="left" className="shrink-0" title={null} left={<TMTLogoHomeLink />} />}
      floating={
        <ViewSwitchButton
          view={view}
          onToggle={() => setView((prev) => (prev === "feed" ? "map" : "feed"))}
        />
      }
    >
      <div
        className={
          view === "feed"
            ? "flex min-h-full shrink-0 flex-col bg-surface-secondary"
            : "flex min-h-0 flex-1 flex-col bg-surface-secondary"
        }
      >
        {view === "feed" ? (
          <div className="sticky top-0 z-overlay flex shrink-0 flex-col gap-ds-12 bg-surface-primary px-ds-20 py-ds-12">
            {searchBar}
            <FeedCurationChips
              selectedId={curationTagId}
              onSelect={search.selectCuration}
              className="flex-nowrap overflow-x-auto"
            />
          </div>
        ) : null}
        <FeedBody
          view={view}
          position={position}
          query={query}
          curationTagId={curationTagId}
          onCurationSelect={search.selectCuration}
          searchBar={searchBar}
        />
      </div>
    </ScreenLayout>
  );
}

type FeedBodyProps = {
  view: FeedView;
  position: ResolvedPosition | null;
  query: string | null;
  curationTagId: string | null;
  onCurationSelect: (id: string | null) => void;
  searchBar: ReactNode;
};

function FeedBody({
  view,
  position,
  query,
  curationTagId,
  onCurationSelect,
  searchBar,
}: FeedBodyProps) {
  if (view === "map") {
    return (
      <FeedMapView
        position={position}
        query={query}
        curationTagId={curationTagId}
        onCurationSelect={onCurationSelect}
        searchBar={searchBar}
      />
    );
  }

  // 명세 §0 — 검색어·칩이 있으면 목록이 리뷰 카드에서 가게 카드로 바뀐다.
  if (query || curationTagId) {
    return <FeedSearchResults position={position} query={query} curationTagId={curationTagId} />;
  }

  return <FeedListView position={position} />;
}

type ViewSwitchButtonProps = {
  view: FeedView;
  onToggle: () => void;
};

/** 피드 ↔ 지도 전환. 시안이 FAB 하나로 양방향을 처리한다. */
function ViewSwitchButton({ view, onToggle }: ViewSwitchButtonProps) {
  const isFeed = view === "feed";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isFeed ? "지도로 보기" : "피드로 보기"}
      className="pointer-events-auto absolute right-ds-20 bottom-ds-0 z-overlay rounded-ds-md bg-surface-interactive-secondary p-ds-8 text-icon-interactive-inverse"
    >
      {isFeed ? <MapIcon size={24} /> : <FeedIcon filled size={24} />}
    </button>
  );
}
