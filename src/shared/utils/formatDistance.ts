/** 미터를 화면 표기로 바꾼다 — 1km 미만은 `505m`, 이상은 `1.2km`. */
export function formatDistance(meters: number): string {
  return meters < 1000 ? `${Math.round(meters)}m` : `${(meters / 1000).toFixed(1)}km`;
}
