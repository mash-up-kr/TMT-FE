"use client";

import { useEffect, useRef, useState } from "react";
import { loadNaverMaps } from "@/shared/utils/naverMaps";
import type { MapBounds } from "../_hooks/useNearbyPins";
import { buildMarkerIcon } from "../_utils/mapPinIcon";
import type { NearbyPin } from "../_utils/nearbyMapper";

/** 권한 거부 시 보내는 기준 좌표 — 강남역 (명세 E3). */
const FALLBACK_CENTER = { latitude: 37.4979, longitude: 127.0276 };
const DEFAULT_ZOOM = 15;

type NearbyMapProps = {
  /** 초기 중심. 위치 권한이 늦게 확정되므로 확정되는 시점에 한 번만 반영한다. */
  centerLatitude: number | null;
  centerLongitude: number | null;
  pins: NearbyPin[];
  /** 선택된 핀은 이름 라벨과 함께 크게 그린다 (시안 1340:28900). */
  selectedPlaceId: string | null;
  onBoundsChange: (bounds: MapBounds) => void;
  onPinClick: (placeId: string) => void;
};

function isSameBounds(previous: MapBounds | null, next: MapBounds) {
  return (
    previous !== null &&
    previous.north === next.north &&
    previous.south === next.south &&
    previous.east === next.east &&
    previous.west === next.west
  );
}

export function NearbyMap({
  centerLatitude,
  centerLongitude,
  pins,
  selectedPlaceId,
  onBoundsChange,
  onPinClick,
}: NearbyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const lastBoundsRef = useRef<MapBounds | null>(null);
  const centeredRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 최신 콜백·좌표를 ref로 들고 있어야 지도를 다시 만들지 않는다.
  const boundsChangeRef = useRef(onBoundsChange);
  boundsChangeRef.current = onBoundsChange;
  const pinClickRef = useRef(onPinClick);
  pinClickRef.current = onPinClick;

  // 지도는 마운트당 한 번만 만든다. 의존성이 있으면 렌더마다 재생성돼 깜빡인다.
  useEffect(() => {
    let disposed = false;
    const container = containerRef.current;

    if (!container) {
      return;
    }

    loadNaverMaps()
      .then((maps) => {
        if (disposed) {
          return;
        }

        const map = new maps.Map(container, {
          center: new maps.LatLng(FALLBACK_CENTER.latitude, FALLBACK_CENTER.longitude),
          zoom: DEFAULT_ZOOM,
        });

        mapRef.current = map;

        const emitBounds = () => {
          const bounds = map.getBounds() as naver.maps.LatLngBounds;
          const next: MapBounds = {
            north: bounds.north(),
            south: bounds.south(),
            east: bounds.east(),
            west: bounds.west(),
          };

          // 같은 영역을 다시 알리면 상태가 갱신돼 불필요한 렌더가 반복된다.
          if (isSameBounds(lastBoundsRef.current, next)) {
            return;
          }

          lastBoundsRef.current = next;
          boundsChangeRef.current(next);
        };

        maps.Event.addListener(map, "idle", emitBounds);
        emitBounds();
        setReady(true);
      })
      .catch((cause: unknown) => {
        if (!disposed) {
          setError(cause instanceof Error ? cause.message : "지도를 불러오지 못했어요.");
        }
      });

    return () => {
      disposed = true;
      for (const marker of markersRef.current) {
        marker.setMap(null);
      }
      markersRef.current = [];
      mapRef.current?.destroy();
      mapRef.current = null;
    };
  }, []);

  // 위치 권한이 확정되면 중심을 한 번만 옮긴다. 이후 사용자가 움직인 위치를 덮지 않는다.
  useEffect(() => {
    const map = mapRef.current;

    if (!ready || !map || centeredRef.current) {
      return;
    }

    if (centerLatitude === null || centerLongitude === null) {
      return;
    }

    centeredRef.current = true;
    map.setCenter(new naver.maps.LatLng(centerLatitude, centerLongitude));
  }, [ready, centerLatitude, centerLongitude]);

  // 핀은 지도와 별개로 갱신한다.
  useEffect(() => {
    const map = mapRef.current;

    if (!ready || !map) {
      return;
    }

    const maps = naver.maps;

    for (const marker of markersRef.current) {
      marker.setMap(null);
    }

    markersRef.current = pins.map((pin) => {
      const icon = buildMarkerIcon(pin, pin.id === selectedPlaceId);
      const marker = new maps.Marker({
        map,
        position: new maps.LatLng(pin.latitude, pin.longitude),
        title: pin.name,
        icon: {
          content: icon.content,
          size: new maps.Size(icon.size.width, icon.size.height),
          anchor: new maps.Point(icon.anchor.x, icon.anchor.y),
        },
        // 선택된 핀이 라벨까지 가진 큰 마커라 다른 핀 위에 오도록 올린다.
        zIndex: pin.id === selectedPlaceId ? 100 : 1,
      });

      maps.Event.addListener(marker, "click", () => pinClickRef.current(pin.id));

      return marker;
    });
  }, [ready, pins, selectedPlaceId]);

  if (error) {
    return (
      <div
        role="alert"
        className="flex flex-1 items-center justify-center bg-surface-secondary px-ds-20 text-center text-body-md-medium text-content-secondary"
      >
        {error}
      </div>
    );
  }

  return <div ref={containerRef} className="min-h-0 flex-1" />;
}
