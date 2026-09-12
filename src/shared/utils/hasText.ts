/**
 * 값이 "있는 문자열"인지. 빈 문자열과 공백만 있는 문자열은 없는 것으로 본다.
 *
 * 스펙상 nullable인 필드가 있어 `undefined`와 `null`을 함께 받는다. mapper들이 같은 규칙으로
 * 빈 값을 `null`로 고치므로 한 곳에 둔다 — 각자 적으면 한쪽만 다른 기준이 되어도 조용히 통과한다.
 */
export function hasText(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
