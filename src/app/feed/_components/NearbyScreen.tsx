"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ScreenLayout } from "@/shared/components/ScreenLayout";
import { TMTLogoHomeLink } from "@/shared/components/TMTLogoHomeLink";
import { ROUTES } from "@/shared/constants/routes";
import { type ResolvedPosition, useResolvedPosition } from "@/shared/hooks/useResolvedPosition";
import { GNB } from "@/shared/ui/GNB";
import { FeedIcon, MapIcon } from "@/shared/ui/Icons";
import { NearbyCurationChips } from "./NearbyCurationChips";
import { NearbyFeedView } from "./NearbyFeedView";
import { NearbyMapView } from "./NearbyMapView";
import { NearbySearchEntry } from "./NearbySearchEntry";
import { NearbySearchResults } from "./NearbySearchResults";

type NearbyView = "feed" | "map";

export function NearbyScreen() {
  const position = useResolvedPosition();
  const [view, setView] = useState<NearbyView>("feed");
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("q");
  const curationTagId = searchParams.get("curation");

  const handleCurationSelect = (next: string | null) => {
    const params = new URLSearchParams(searchParams);

    if (next) {
      params.set("curation", next);
    } else {
      params.delete("curation");
    }

    router.replace(params.size > 0 ? `${ROUTES.FEED}?${params}` : ROUTES.FEED);
  };

  return (
    <ScreenLayout
      bodyScrollable={view === "feed"}
      header={<GNB align="left" className="shrink-0" title={null} left={<TMTLogoHomeLink />} />}
      floating={
        <ViewSwitchButton
          view={view}
          onToggle={() => setView((prev) => (prev === "feed" ? "map" : "feed"))}
        />
      }
    >
      <div className="flex min-h-0 flex-1 flex-col bg-surface-secondary">
        {view === "feed" ? (
          <div className="flex shrink-0 flex-col gap-ds-12 bg-surface-primary px-ds-20 py-ds-12">
            <NearbySearchEntry keyword={query} />
            <NearbyCurationChips
              selectedId={curationTagId}
              onSelect={handleCurationSelect}
              className="flex-nowrap overflow-x-auto"
            />
          </div>
        ) : null}
        <NearbyBody
          view={view}
          position={position}
          query={query}
          curationTagId={curationTagId}
          onCurationSelect={handleCurationSelect}
        />
      </div>
    </ScreenLayout>
  );
}

type NearbyBodyProps = {
  view: NearbyView;
  position: ResolvedPosition | null;
  query: string | null;
  curationTagId: string | null;
  onCurationSelect: (id: string | null) => void;
};

function NearbyBody({ view, position, query, curationTagId, onCurationSelect }: NearbyBodyProps) {
  if (view === "map") {
    return (
      <NearbyMapView
        position={position}
        query={query}
        curationTagId={curationTagId}
        onCurationSelect={onCurationSelect}
      />
    );
  }

  // 명세 §0 — 검색어·칩이 있으면 목록이 리뷰 카드에서 가게 카드로 바뀐다.
  if (query || curationTagId) {
    return <NearbySearchResults position={position} query={query} curationTagId={curationTagId} />;
  }

  return <NearbyFeedView position={position} />;
}

type ViewSwitchButtonProps = {
  view: NearbyView;
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
