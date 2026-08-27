"use client";

import { useState } from "react";
import type { ResolvedPosition } from "@/shared/hooks/useResolvedPosition";
import { type MapBounds, useNearbyPins } from "../_hooks/useNearbyPins";
import type { NearbyPin } from "../_utils/nearbyMapper";
import { NearbyMap } from "./NearbyMap";
import { PlacePinSheet } from "./PlacePinSheet";

/** 매 렌더 새 배열을 넘기면 마커 effect가 계속 다시 돌아 깜빡인다. */
const EMPTY_PINS: NearbyPin[] = [];

type NearbyMapViewProps = {
  position: ResolvedPosition | null;
};

/** 지도형 — viewport 안의 핀과 핀 클릭 시트 (명세 §2-3). */
export function NearbyMapView({ position }: NearbyMapViewProps) {
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const { data } = useNearbyPins(bounds);

  return (
    <div className="relative isolate flex min-h-0 flex-1 flex-col">
      <NearbyMap
        centerLatitude={position?.latitude ?? null}
        centerLongitude={position?.longitude ?? null}
        pins={data?.pins ?? EMPTY_PINS}
        selectedPlaceId={selectedPlaceId}
        onBoundsChange={setBounds}
        onPinClick={setSelectedPlaceId}
      />
      {data?.truncated ? (
        <p className="-translate-x-1/2 absolute top-ds-12 left-1/2 rounded-ds-full bg-surface-inverse px-ds-12 py-ds-4 text-body-sm-medium text-content-interactive-inverse">
          지도를 확대해 주세요
        </p>
      ) : null}
      <PlacePinSheet placeId={selectedPlaceId} onClose={() => setSelectedPlaceId(null)} />
    </div>
  );
}
