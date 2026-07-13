# 런타임 크래시 방지

## 목적

사용자가 정상적으로 접근할 수 있는 입력이나 상태에서 런타임 예외가 발생하는 코드를 잡습니다.

## 관찰 가능한 신호

- `null` 또는 `undefined` 가능성이 있는 값의 속성을 바로 읽습니다.
- 빈 배열 가능성이 있는데 `[0]`, `.at(0)` 결과를 바로 사용합니다.
- 매개변수 타입에는 있는 값을 구조분해나 스코프에 바인딩하지 않고 참조합니다.
- 외부 입력을 신뢰하고 메서드를 바로 호출합니다.
- 렌더링 경로에서 예외가 나면 화면 전체가 깨질 수 있습니다.

## 게시 조건

- 문제가 추가/수정 라인에 직접 있습니다.
- 상위에서 항상 방어된다는 근거가 없습니다.
- 실제 입력, API 응답, 초기 상태, 빈 상태 중 하나로 재현 가능한 경로가 있습니다.
- guard, fallback, early return처럼 수정 방향이 명확합니다.
- 누락된 구조분해, 누락된 인자 전달, 누락된 변수 바인딩처럼 정확한 코드 수정이 좁은 범위에서 가능합니다.

## 억제 조건

- 타입 시스템이나 schema가 해당 값을 이미 non-null로 보장합니다.
- 호출자가 빈 배열이나 null을 절대 넘기지 않는 계약이 주변 코드에 명확합니다.
- 테스트 fixture나 개발 전용 코드처럼 사용자 경로와 무관합니다.
- 단순히 optional chaining을 선호하는 수준의 취향입니다.

## 나쁜 예

```ts
export function stockBadge(stocks: Stock[]): string {
  return stocks[0].label;
}
```

## 좋은 예

```ts
export function stockBadge(stocks: Stock[]): string {
  const primary = stocks[0];
  if (!primary) {
    return "재고 정보 없음";
  }
  return primary.label;
}
```

## 추가 예시: 타입에는 있지만 스코프에 없는 값 참조

### 나쁜 예

```ts
export async function fetchProfiles({
  filters,
}: {
  filters: ProfileFilters;
  signal?: AbortSignal;
}) {
  signal?.throwIfAborted();
  return requestProfiles(filters, { signal });
}
```

### 좋은 예

```ts
export async function fetchProfiles({
  filters,
  signal,
}: {
  filters: ProfileFilters;
  signal?: AbortSignal;
}) {
  signal?.throwIfAborted();
  return requestProfiles(filters, { signal });
}
```

## Verification rule

- evidence 라인이 실제 추가/수정 라인인지 확인합니다.
- 대상 값이 nullable, optional, 빈 배열, 외부 입력 중 하나인지 확인합니다.
- 참조한 식별자가 현재 스코프에 실제로 바인딩되어 있는지 확인합니다.
- 상위 보장 근거가 없으면 publish 후보로 둡니다.
- 상위 보장 근거가 있으면 suppress합니다.

## PN 기준

공통 리뷰 정책은 [Review Policy](../../Policy.md)를 따릅니다. 아래 내용은 이 rule의 적용 예시입니다.

- `P1`: 흔한 사용자 경로에서 즉시 크래시가 납니다.
- `P2`: 현실적인 사용자 입력이나 API 상태에서 주요 화면/행동이 크래시날 가능성이 큽니다.
- `P3`: 방어 코드가 없어 예외 가능성은 높지만 입력이 제한적이거나 영향이 보조 영역에 머뭅니다.
- `P4`: 방어적 개선이지만 실제 영향이 제한적입니다.
- `P5`: 단순 스타일 선호입니다. 게시하지 않습니다.
