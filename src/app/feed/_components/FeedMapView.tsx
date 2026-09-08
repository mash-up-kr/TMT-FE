"use client";

import { useState } from "react";
import type { ResolvedPosition } from "@/shared/hooks/useResolvedPosition";
import { type MapBounds, useFeedPins } from "../_hooks/useFeedPins";
import type { FeedPin } from "../_utils/feedMapper";
import { FeedCurationChips } from "./FeedCurationChips";
import { FeedMap } from "./FeedMap";
import { FeedSearchEntry } from "./FeedSearchEntry";
import { PlacePinSheet } from "./PlacePinSheet";

/** 매 렌더 새 배열을 넘기면 마커 effect가 계속 다시 돌아 깜빡인다. */
const EMPTY_PINS: FeedPin[] = [];

type FeedMapViewProps = {
  position: ResolvedPosition | null;
  query: string | null;
  curationTagId: string | null;
  onCurationSelect: (id: string | null) => void;
};

/** 지도형 — viewport 안의 핀과 핀 클릭 시트 (명세 §2-3). */
export function FeedMapView({
  position,
  query,
  curationTagId,
  onCurationSelect,
}: FeedMapViewProps) {
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const { data } = useFeedPins(bounds, curationTagId);

  return (
    <div className="relative isolate flex min-h-0 flex-1 flex-col">
      <FeedMap
        centerLatitude={position?.latitude ?? null}
        centerLongitude={position?.longitude ?? null}
        pins={data?.pins ?? EMPTY_PINS}
        selectedPlaceId={selectedPlaceId}
        onBoundsChange={setBounds}
        onPinClick={setSelectedPlaceId}
      />
      <div className="absolute top-ds-12 right-0 left-0 z-overlay flex flex-col gap-ds-12 px-ds-20">
        <FeedSearchEntry keyword={query} />
        <FeedCurationChips
          selectedId={curationTagId}
          onSelect={onCurationSelect}
          className="flex-nowrap overflow-x-auto"
        />
        {data?.truncated ? (
          <p className="self-center rounded-ds-full bg-surface-inverse px-ds-12 py-ds-4 text-body-sm-medium text-content-interactive-inverse">
            지도를 확대해 주세요
          </p>
        ) : null}
      </div>
      <PlacePinSheet placeId={selectedPlaceId} onClose={() => setSelectedPlaceId(null)} />
    </div>
  );
}
