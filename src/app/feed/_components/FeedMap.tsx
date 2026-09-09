"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { loadNaverMaps } from "@/shared/utils/naverMaps";
import type { MapBounds } from "../_hooks/useFeedPins";
import type { FeedPin } from "../_utils/feedMapper";
import { FeedMapPin, MAP_PIN_MARKER } from "./FeedMapPin";

/** 권한 거부 시 보내는 기준 좌표 — 강남역 (명세 E3). */
const FALLBACK_CENTER = { latitude: 37.4979, longitude: 127.0276 };
const DEFAULT_ZOOM = 15;
/**
 * 마커를 놓을 세로 위치. 지도 높이 기준 비율이고 0.5가 정중앙, 작을수록 위로 간다.
 * 핀 시트가 아래를 덮어 정중앙에 두면 가려지므로 위쪽에 둔다.
 */
const MARKER_FOCUS_Y_RATIO = 0.3;
const MARKER_PAN_DURATION_MS = 300;
/** 라벨이 서로 겹치므로 선택된 핀을 위로 올린다. */
const SELECTED_MARKER_Z_INDEX = 100;
const MARKER_Z_INDEX = 1;

/** 마커 하나와 그 안에 React를 그릴 자리. 네이버 SDK는 넘긴 노드를 그대로 붙인다. */
type PinMarker = {
  pin: FeedPin;
  element: HTMLDivElement;
  marker: naver.maps.Marker;
};

type FeedMapProps = {
  /** 초기 중심. 위치 권한이 늦게 확정되므로 확정되는 시점에 한 번만 반영한다. */
  centerLatitude: number | null;
  centerLongitude: number | null;
  pins: FeedPin[];
  selectedPlaceId: string | null;
  onBoundsChange: (bounds: MapBounds) => void;
  onPinClick: (placeId: string) => void;
};

/** 마커를 시트에 가리지 않는 높이로 옮긴다. */
function focusMarker(map: naver.maps.Map, position: naver.maps.Coord) {
  const projection = map.getProjection();
  const offset = projection.fromCoordToOffset(position);
  const mapHeight = map.getSize().height;
  // 마커를 목표 높이에 놓으려면 지도 중심이 그만큼 아래에 있어야 한다.
  const centerY = offset.y + (mapHeight / 2 - mapHeight * MARKER_FOCUS_Y_RATIO);

  map.panTo(projection.fromOffsetToCoord(new naver.maps.Point(offset.x, centerY)), {
    duration: MARKER_PAN_DURATION_MS,
  });
}

function isSameBounds(previous: MapBounds | null, next: MapBounds) {
  return (
    previous !== null &&
    previous.north === next.north &&
    previous.south === next.south &&
    previous.east === next.east &&
    previous.west === next.west
  );
}

export function FeedMap({
  centerLatitude,
  centerLongitude,
  pins,
  selectedPlaceId,
  onBoundsChange,
  onPinClick,
}: FeedMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const pinMarkersRef = useRef<PinMarker[]>([]);
  const [pinMarkers, setPinMarkers] = useState<PinMarker[]>([]);
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
      for (const { marker } of pinMarkersRef.current) {
        marker.setMap(null);
      }
      pinMarkersRef.current = [];
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

  // 핀은 지도와 별개로 갱신한다. 선택 상태는 여기 끼지 않는다 — 끼면 클릭마다 마커가
  // 새로 만들어져 이전 크기를 잃고, 커지는 전환이 걸리지 않는다.
  useEffect(() => {
    const map = mapRef.current;

    if (!ready || !map) {
      return;
    }

    const maps = naver.maps;

    for (const { marker } of pinMarkersRef.current) {
      marker.setMap(null);
    }

    const next = pins.map((pin) => {
      // 마커 내용을 우리가 소유하는 노드로 넘기고, 그 안을 React가 계속 그린다.
      const element = document.createElement("div");
      const marker = new maps.Marker({
        map,
        position: new maps.LatLng(pin.latitude, pin.longitude),
        title: pin.name,
        icon: {
          content: element,
          size: new maps.Size(MAP_PIN_MARKER.size.width, MAP_PIN_MARKER.size.height),
          anchor: new maps.Point(MAP_PIN_MARKER.anchor.x, MAP_PIN_MARKER.anchor.y),
        },
      });

      maps.Event.addListener(marker, "click", () => {
        focusMarker(map, marker.getPosition());
        pinClickRef.current(pin.id);
      });

      return { pin, element, marker };
    });

    pinMarkersRef.current = next;
    setPinMarkers(next);
  }, [ready, pins]);

  // 선택이 바뀌면 마커는 그대로 두고 쌓임 순서만 손댄다. 크기 변화는 React가 그린다.
  useEffect(() => {
    for (const { pin, marker } of pinMarkers) {
      marker.setZIndex(pin.id === selectedPlaceId ? SELECTED_MARKER_Z_INDEX : MARKER_Z_INDEX);
    }
  }, [pinMarkers, selectedPlaceId]);

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

  return (
    <>
      <div ref={containerRef} className="min-h-0 flex-1" />
      {pinMarkers.map(({ pin, element }) =>
        createPortal(
          <FeedMapPin pin={pin} selected={pin.id === selectedPlaceId} />,
          element,
          pin.id,
        ),
      )}
    </>
  );
}
