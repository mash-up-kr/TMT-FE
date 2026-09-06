"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ScreenLayout } from "@/shared/components/ScreenLayout";
import { TMTLogoHomeLink } from "@/shared/components/TMTLogoHomeLink";
import { ROUTES } from "@/shared/constants/routes";
import { type ResolvedPosition, useResolvedPosition } from "@/shared/hooks/useResolvedPosition";
import { GNB } from "@/shared/ui/GNB";
import { FeedIcon, MapIcon } from "@/shared/ui/Icons";
import { cn } from "@/shared/utils/cn";
import { NearbyCurationChips } from "./NearbyCurationChips";
import { NearbyFeedView } from "./NearbyFeedView";
import { NearbyMapView } from "./NearbyMapView";
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
      header={<GNB align="left" className="shrink-0" title={null} left={<TMTLogoHomeLink />} />}
      floating={
        <ViewSwitchButton
          view={view}
          onToggle={() => setView((prev) => (prev === "feed" ? "map" : "feed"))}
        />
      }
    >
      <div className="flex min-h-0 flex-1 flex-col bg-surface-secondary">
        <div className="flex shrink-0 flex-col gap-ds-12 bg-surface-primary px-ds-20 py-ds-12">
          <SearchEntry keyword={query} />
          {view === "feed" ? (
            <NearbyCurationChips selectedId={curationTagId} onSelect={handleCurationSelect} />
          ) : null}
        </div>
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

function SearchEntry({ keyword }: { keyword: string | null }) {
  return (
    <Link
      href={ROUTES.SEARCH}
      className={cn(
        "block w-full truncate rounded-ds-md border-sm border-stroke-field bg-surface-primary px-ds-16 py-ds-12 text-left text-body-lg-medium",
        keyword ? "text-content-primary" : "text-content-tertiary",
      )}
    >
      {keyword ?? "장소나 태그로 검색해보세요"}
    </Link>
  );
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
      className="absolute right-ds-20 bottom-ds-20 z-overlay rounded-ds-md bg-surface-interactive-secondary p-ds-8 text-icon-interactive-inverse"
    >
      {isFeed ? <MapIcon size={24} /> : <FeedIcon filled size={24} />}
    </button>
  );
}
