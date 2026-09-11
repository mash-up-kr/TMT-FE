"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { PreciseCoordinates } from "@/shared/hooks/useCurrentPosition";
import { loadNaverMaps } from "@/shared/utils/naverMaps";
import type { MapBounds } from "../_hooks/useFeedPins";
import type { FeedPin } from "../_utils/feedMapper";
import { FeedMapPinMarker, MAP_PIN_ATTRIBUTE } from "./FeedMapPinMarker";
import { FeedMyLocationPin, MY_LOCATION_MARKER } from "./FeedMyLocationPin";

/** 권한 거부 시 보내는 기준 좌표 — 강남역 (명세 E3). */
const FALLBACK_CENTER = { latitude: 37.4979, longitude: 127.0276 };
const DEFAULT_ZOOM = 15;
/**
 * 마커를 놓을 세로 위치. 지도 높이 기준 비율이고 0.5가 정중앙, 작을수록 위로 간다.
 * 핀 시트가 아래를 덮어 정중앙에 두면 가려지므로 위쪽에 둔다.
 */
const MARKER_FOCUS_Y_RATIO = 0.3;
const MARKER_PAN_DURATION_MS = 300;
/** 내 위치는 매장 핀 아래에 둔다. 탐색 대상은 매장이고 내 위치는 배경 정보다. */
const MY_LOCATION_Z_INDEX = 0;
const ACCURACY_CIRCLE_FILL_OPACITY = 0.12;
const ACCURACY_CIRCLE_STROKE_OPACITY = 0.4;
const ACCURACY_CIRCLE_STROKE_WEIGHT = 1;

function readToken(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

type FeedMapProps = {
  /** 초기 중심. 위치 권한이 늦게 확정되므로 확정되는 시점에 한 번만 반영한다. */
  centerLatitude: number | null;
  centerLongitude: number | null;
  pins: FeedPin[];
  /** 측위에 성공했을 때의 내 위치. 대체 좌표를 쓰는 동안에는 `null`이라 점을 그리지 않는다. */
  myLocation: PreciseCoordinates | null;
  selectedPlaceId: string | null;
  onBoundsChange: (bounds: MapBounds) => void;
  onPinClick: (placeId: string) => void;
  /** 핀이 아닌 빈 지도를 눌렀을 때. 드래그와 핀 클릭으로는 오지 않는다. */
  onMapClick: () => void;
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
  myLocation,
  selectedPlaceId,
  onBoundsChange,
  onPinClick,
  onMapClick,
}: FeedMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const [myLocationElement, setMyLocationElement] = useState<HTMLDivElement | null>(null);
  const lastBoundsRef = useRef<MapBounds | null>(null);
  const centeredRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  // 최신 콜백을 ref로 들고 있어야 지도를 다시 만들지 않는다.
  const boundsChangeRef = useRef(onBoundsChange);
  boundsChangeRef.current = onBoundsChange;
  const mapClickRef = useRef(onMapClick);
  mapClickRef.current = onMapClick;

  // 지도는 마운트당 한 번만 만든다. 의존성이 있으면 렌더마다 재생성돼 깜빡인다.
  useEffect(() => {
    let disposed = false;
    let created: naver.maps.Map | null = null;
    const container = containerRef.current;

    if (!container) {
      return;
    }

    loadNaverMaps()
      .then((maps) => {
        if (disposed) {
          return;
        }

        const instance = new maps.Map(container, {
          center: new maps.LatLng(FALLBACK_CENTER.latitude, FALLBACK_CENTER.longitude),
          zoom: DEFAULT_ZOOM,
        });

        created = instance;

        const emitBounds = () => {
          const bounds = instance.getBounds() as naver.maps.LatLngBounds;
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

        maps.Event.addListener(instance, "idle", emitBounds);
        maps.Event.addListener(instance, "click", (event: naver.maps.PointerEvent) => {
          // 핀을 누르면 그 클릭이 지도까지 올라와 지도 클릭도 함께 일어난다. 그대로 두면 핀이
          // 고른 매장을 곧바로 지워 시트가 닫힌다.
          const target = event.pointerEvent.target;

          if (target instanceof Element && target.closest(`[${MAP_PIN_ATTRIBUTE}]`)) {
            return;
          }

          mapClickRef.current();
        });
        emitBounds();
        setMap(instance);
      })
      .catch((cause: unknown) => {
        if (!disposed) {
          setError(cause instanceof Error ? cause.message : "지도를 불러오지 못했어요.");
        }
      });

    return () => {
      disposed = true;
      const instance = created;
      created = null;

      // 마커는 자식 컴포넌트와 아래 effect가 소유한다. React는 이 정리를 먼저 돌리므로
      // 지도를 여기서 곧바로 걷어내면 아직 물러나지 않은 마커가 사라진 지도를 참조한다.
      queueMicrotask(() => instance?.destroy());
    };
  }, []);

  // 위치 권한이 확정되면 중심을 한 번만 옮긴다. 이후 사용자가 움직인 위치를 덮지 않는다.
  useEffect(() => {
    if (!map || centeredRef.current) {
      return;
    }

    if (centerLatitude === null || centerLongitude === null) {
      return;
    }

    centeredRef.current = true;
    map.setCenter(new naver.maps.LatLng(centerLatitude, centerLongitude));
  }, [map, centerLatitude, centerLongitude]);

  // 내 위치는 매장 핀과 생애가 달라 따로 관리한다. 좌표가 바뀌면 점과 원을 다시 만드는데,
  // 측위 결과는 몇 분에 한 번만 갱신되므로 재생성 비용이 없다.
  useEffect(() => {
    if (!map || !myLocation) {
      return;
    }

    const maps = naver.maps;
    const center = new maps.LatLng(myLocation.latitude, myLocation.longitude);
    const color = readToken("--color-content-info");
    const circle = new maps.Circle({
      map,
      center,
      radius: myLocation.accuracy,
      fillColor: color,
      fillOpacity: ACCURACY_CIRCLE_FILL_OPACITY,
      strokeColor: color,
      strokeOpacity: ACCURACY_CIRCLE_STROKE_OPACITY,
      strokeWeight: ACCURACY_CIRCLE_STROKE_WEIGHT,
      clickable: false,
    });

    const element = document.createElement("div");
    const marker = new maps.Marker({
      map,
      position: center,
      clickable: false,
      zIndex: MY_LOCATION_Z_INDEX,
      icon: {
        content: element,
        size: new maps.Size(MY_LOCATION_MARKER.size.width, MY_LOCATION_MARKER.size.height),
        anchor: new maps.Point(MY_LOCATION_MARKER.anchor.x, MY_LOCATION_MARKER.anchor.y),
      },
    });

    setMyLocationElement(element);

    return () => {
      marker.setMap(null);
      circle.setMap(null);
      setMyLocationElement(null);
    };
  }, [map, myLocation]);

  function handleSelect(pin: FeedPin) {
    if (map) {
      focusMarker(map, new naver.maps.LatLng(pin.latitude, pin.longitude));
    }

    onPinClick(pin.id);
  }

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
      {map
        ? pins.map((pin) => (
            <FeedMapPinMarker
              key={pin.id}
              map={map}
              pin={pin}
              selected={pin.id === selectedPlaceId}
              onSelect={handleSelect}
            />
          ))
        : null}
      {myLocationElement ? createPortal(<FeedMyLocationPin />, myLocationElement) : null}
    </>
  );
}
