"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/shared/components/AppShell/AppShell";
import { type ResolvedPosition, useResolvedPosition } from "@/shared/hooks/useResolvedPosition";
import { Chip } from "@/shared/ui/Chip";
import { FeedIcon, MapIcon } from "@/shared/ui/Icons";
import { cn } from "@/shared/utils/cn";
import { useCurationChips } from "../_hooks/useCurationChips";
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

  return (
    <AppShell
      tab="feed"
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
          <CurationChips
            selectedId={curationTagId}
            onSelect={(next) => {
              const params = new URLSearchParams(searchParams);

              if (next) {
                params.set("curation", next);
              } else {
                params.delete("curation");
              }

              router.replace(params.size > 0 ? `/nearby?${params}` : "/nearby");
            }}
          />
        </div>
        <NearbyBody view={view} position={position} query={query} curationTagId={curationTagId} />
      </div>
    </AppShell>
  );
}

type NearbyBodyProps = {
  view: NearbyView;
  position: ResolvedPosition | null;
  query: string | null;
  curationTagId: string | null;
};

function NearbyBody({ view, position, query, curationTagId }: NearbyBodyProps) {
  if (view === "map") {
    return <NearbyMapView position={position} />;
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
      href="/nearby/search"
      className={cn(
        "block w-full truncate rounded-ds-md border-sm border-stroke-field bg-surface-primary px-ds-16 py-ds-12 text-left text-body-lg-medium",
        keyword ? "text-content-primary" : "text-content-tertiary",
      )}
    >
      {keyword ?? "장소나 태그로 검색해보세요"}
    </Link>
  );
}

type CurationChipsProps = {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

function CurationChips({ selectedId, onSelect }: CurationChipsProps) {
  const { data: chips } = useCurationChips();

  if (!chips || chips.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-ds-8">
      {chips.map((chip) => (
        <Chip
          key={chip.id}
          size="lg"
          selected={chip.id === selectedId}
          onClick={() => onSelect(chip.id === selectedId ? null : chip.id)}
        >
          {chip.label}
        </Chip>
      ))}
    </div>
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
      {isFeed ? <MapIcon size={24} /> : <FeedIcon size={24} />}
    </button>
  );
}
