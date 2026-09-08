import type { NearbyPin } from "./nearbyMapper";

/**
 * 지도 핀 마커의 HTML. 네이버 SDK는 커스텀 마커를 HTML 문자열로 받는다(HtmlIcon).
 *
 * 마커는 페이지 DOM 안에 붙으므로 CSS 변수가 상속된다 — 색은 semantic 토큰을 참조한다.
 *
 * 시안 실측(1340:28900 · 1041:22021) — 선택된 핀은 56px에 이름 라벨이 붙고 나머지는 24px이며,
 * 크기와 무관하게 물방울 안에 흰 원이 있다. 흰 원을 viewBox 안에 그려 두 크기가 같은 비율을
 * 유지하게 한다. 원 안 카테고리 아이콘은 `GET /v1/nearby/places` 응답에 카테고리가 없어
 * 아직 비워둔다.
 */
const TEARDROP_WIDTH = 42;
const TEARDROP_HEIGHT = 52;
/** 흰 원. 시안의 inset(좌 21.43%·상 12.5%)을 viewBox 좌표로 환산한 값이다. */
const HOLE_CENTER_X = 21;
const HOLE_CENTER_Y = 21.2727;
const HOLE_RADIUS = 6;
const SELECTED_PIN_SIZE = 56;
const PIN_SIZE = 24;
const LABEL_HEIGHT = 20;

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
  /** 물방울 꼭지가 좌표를 가리키도록 아래 중앙을 기준점으로 잡는다. */
  anchor: { x: number; y: number };
}

export function buildMarkerIcon(pin: NearbyPin, selected: boolean): MarkerIcon {
  if (!selected) {
    const dropWidth = Math.round((PIN_SIZE * TEARDROP_WIDTH) / TEARDROP_HEIGHT);

    return {
      content: `<div style="width:${dropWidth}px;height:${PIN_SIZE}px;">${teardrop(dropWidth)}</div>`,
      size: { width: dropWidth, height: PIN_SIZE },
      anchor: { x: Math.round(dropWidth / 2), y: PIN_SIZE },
    };
  }

  const dropWidth = Math.round((SELECTED_PIN_SIZE * TEARDROP_WIDTH) / TEARDROP_HEIGHT);
  const height = SELECTED_PIN_SIZE + LABEL_HEIGHT;

  return {
    content:
      `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;width:${SELECTED_PIN_SIZE}px;">` +
      `<div style="display:flex;justify-content:center;width:${SELECTED_PIN_SIZE}px;height:${SELECTED_PIN_SIZE}px;">${teardrop(dropWidth)}</div>` +
      `<span style="font-size:12px;line-height:18px;font-weight:700;color:var(--color-content-primary);white-space:nowrap;">${escapeHtml(pin.name)}</span>` +
      `</div>`,
    size: { width: SELECTED_PIN_SIZE, height },
    anchor: { x: Math.round(SELECTED_PIN_SIZE / 2), y: SELECTED_PIN_SIZE },
  };
}
