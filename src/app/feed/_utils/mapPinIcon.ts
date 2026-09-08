import type { FeedPin } from "./feedMapper";

/**
 * 지도 핀 마커의 HTML. 네이버 SDK는 커스텀 마커를 HTML 문자열로 받는다(HtmlIcon).
 *
 * 마커는 페이지 DOM 안에 붙으므로 전역 Tailwind 유틸리티가 그대로 먹는다 — 색과 타이포는
 * 클래스로 토큰을 참조한다. 물방울 크기만 상수로 두는데, 같은 값을 `maps.Size`·`maps.Point`에도
 * 넘겨야 해서 한 곳에서 계산해야 하기 때문이다.
 */
const TEARDROP_WIDTH = 42;
const TEARDROP_HEIGHT = 52;
/** 흰 원. 시안의 inset(좌 21.43%·상 12.5%)을 viewBox 좌표로 환산한 값이다. */
const HOLE_CENTER_X = 21;
const HOLE_CENTER_Y = 21.2727;
const HOLE_RADIUS = 6;
const SELECTED_PIN_SIZE = 56;
const PIN_SIZE = 24;
/** 라벨 한 줄(18px)과 핀과의 간격(2px). */
const LABEL_BLOCK_HEIGHT = 20;
const LABEL_STROKE = "-webkit-text-stroke:1px var(--color-stroke-inverse);paint-order:stroke fill";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function teardrop(width: number) {
  const height = Math.round((width * TEARDROP_HEIGHT) / TEARDROP_WIDTH);

  return (
    `<svg width="${width}" height="${height}" viewBox="0 0 ${TEARDROP_WIDTH} ${TEARDROP_HEIGHT}" fill="none" xmlns="http://www.w3.org/2000/svg">` +
    `<path d="M42 21.2727C42 37.8182 21 52 21 52C21 52 0 37.8182 0 21.2727C8.29927e-08 15.6308 2.21249 10.22 6.15076 6.23064C10.089 2.24123 15.4305 0 21 0C26.5695 0 31.911 2.24123 35.8492 6.23064C39.7875 10.22 42 15.6308 42 21.2727Z" fill="var(--color-surface-brand)"/>` +
    `<circle cx="${HOLE_CENTER_X}" cy="${HOLE_CENTER_Y}" r="${HOLE_RADIUS}" fill="var(--color-surface-primary)"/>` +
    `</svg>`
  );
}

export interface MarkerIcon {
  content: string;
  size: { width: number; height: number };
  /** 물방울 꼭지가 좌표를 가리키도록 핀 아래 중앙을 기준점으로 잡는다. */
  anchor: { x: number; y: number };
}

export function buildMarkerIcon(pin: FeedPin, selected: boolean): MarkerIcon {
  const pinSize = selected ? SELECTED_PIN_SIZE : PIN_SIZE;
  const dropWidth = Math.round((pinSize * TEARDROP_WIDTH) / TEARDROP_HEIGHT);

  return {
    content:
      `<div class="flex flex-col items-center gap-ds-2" style="width:${pinSize}px">` +
      `<div class="flex justify-center" style="width:${pinSize}px;height:${pinSize}px">${teardrop(dropWidth)}</div>` +
      `<span class="pointer-events-none whitespace-nowrap text-body-sm-bold text-content-primary" style="${LABEL_STROKE}">${escapeHtml(pin.name)}</span>` +
      `</div>`,
    size: { width: pinSize, height: pinSize + LABEL_BLOCK_HEIGHT },
    anchor: { x: Math.round(pinSize / 2), y: pinSize },
  };
}
