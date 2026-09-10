/**
 * 내 위치 점.
 *
 * 시안이 아직 없어 지도 관례(파란 점 + 흰 링)를 따른다. 매장 핀이 브랜드 빨강 물방울이라
 * 같은 계열을 쓰면 구분되지 않으므로 info 계열을 쓴다. 시안이 나오면 이 파일만 고친다.
 */

/** 파란 점의 지름. 링은 그 바깥으로 더해진다. */
const DOT_SIZE = 14;
const RING_WIDTH = 3;
const MARKER_SIZE = DOT_SIZE + RING_WIDTH * 2;

/**
 * 마커가 차지하는 상자와 좌표를 가리키는 지점. 매장 핀은 물방울 꼭지가 좌표를 가리키지만
 * 내 위치는 점 자체가 위치라 상자 중앙을 기준점으로 잡는다.
 */
export const MY_LOCATION_MARKER = {
  size: { width: MARKER_SIZE, height: MARKER_SIZE },
  anchor: { x: MARKER_SIZE / 2, y: MARKER_SIZE / 2 },
};

export function FeedMyLocationPin() {
  return (
    <div
      className="rounded-ds-full border-solid border-stroke-inverse bg-content-info shadow-raised"
      style={{ width: MARKER_SIZE, height: MARKER_SIZE, borderWidth: RING_WIDTH }}
    />
  );
}
