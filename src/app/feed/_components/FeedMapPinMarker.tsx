"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { FeedPin } from "../_utils/feedMapper";
import { FeedMapPin, MAP_PIN_MARKER } from "./FeedMapPin";

/** 라벨이 서로 겹치므로 선택된 핀을 위로 올린다. */
const SELECTED_Z_INDEX = 100;
const DEFAULT_Z_INDEX = 1;

type FeedMapPinMarkerProps = {
  map: naver.maps.Map;
  pin: FeedPin;
  selected: boolean;
  onSelect: (pin: FeedPin) => void;
};

/**
 * 핀 하나의 마커 수명을 소유한다. 마운트되면 스스로 지도에 올라가고 언마운트되면 스스로
 * 물러난다. 같은 매장이 화면에 남아 있는 한 key가 이 컴포넌트를 살려두므로, 지도를 움직여도
 * 마커와 그 안의 전환 상태가 이어진다.
 */
export function FeedMapPinMarker({ map, pin, selected, onSelect }: FeedMapPinMarkerProps) {
  // 마커 내용을 우리가 소유하는 노드로 넘기고, 그 안을 React가 계속 그린다.
  const [element] = useState(() => document.createElement("div"));
  const markerRef = useRef<naver.maps.Marker | null>(null);
  // 마커를 다시 만들지 않고도 최신 값을 읽으려면 ref로 들고 있어야 한다.
  const pinRef = useRef(pin);
  pinRef.current = pin;
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;

  // 마커는 마운트당 한 번만 만든다. 이후 변화는 아래 effect가 값만 옮긴다.
  useEffect(() => {
    const maps = naver.maps;
    const created = pinRef.current;
    const marker = new maps.Marker({
      map,
      position: new maps.LatLng(created.latitude, created.longitude),
      title: created.name,
      icon: {
        content: element,
        size: new maps.Size(MAP_PIN_MARKER.size.width, MAP_PIN_MARKER.size.height),
        anchor: new maps.Point(MAP_PIN_MARKER.anchor.x, MAP_PIN_MARKER.anchor.y),
      },
    });

    markerRef.current = marker;

    const click = maps.Event.addListener(marker, "click", () => selectRef.current(pinRef.current));

    return () => {
      maps.Event.removeListener(click);
      marker.setMap(null);
      markerRef.current = null;
    };
  }, [map, element]);

  useEffect(() => {
    markerRef.current?.setPosition(new naver.maps.LatLng(pin.latitude, pin.longitude));
  }, [pin.latitude, pin.longitude]);

  useEffect(() => {
    markerRef.current?.setZIndex(selected ? SELECTED_Z_INDEX : DEFAULT_Z_INDEX);
  }, [selected]);

  return createPortal(<FeedMapPin pin={pin} selected={selected} />, element);
}
