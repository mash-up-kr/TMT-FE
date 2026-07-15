# 빈 상태와 경계값 처리

## 목적

빈 배열, 0, 빈 문자열, 음수, `NaN`, 로딩/에러 상태처럼 흔한 경계값에서 깨지는 동작을 잡습니다.

## 관찰 가능한 신호

- 목록이 비었을 때 첫 요소를 사용하거나 평균/비율 계산을 합니다.
- `0`을 falsy로 처리해 유효한 값을 누락합니다.
- 로딩, 에러, 빈 상태 중 하나가 렌더링 경로에 없습니다.
- 음수나 아주 큰 값이 계산 결과를 깨뜨릴 수 있습니다.

## 게시 조건

- 경계값이 실제 입력으로 들어올 수 있습니다.
- 잘못된 UI, 잘못된 계산, 런타임 오류로 이어집니다.
- fallback, empty state, guard, clamp 등 수정 방향이 명확합니다.
- 추가/수정 라인과 직접 연결됩니다.

## 억제 조건

- 상위 단계에서 빈 상태나 경계값을 이미 제거합니다.
- 테스트 전용 예시입니다.
- 실제 도메인에서 불가능한 값입니다.
- 단순히 더 친절한 빈 상태 UI를 선호하는 수준입니다.

## 나쁜 예

```ts
const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;
const displayPrice = price || "가격 정보 없음";
const quantity = Number(quantityInput);
const totalPrice = unitPrice * quantity;
```

## 좋은 예

```ts
const average = prices.length === 0
  ? 0
  : prices.reduce((sum, price) => sum + price, 0) / prices.length;

const displayPrice = price ?? "가격 정보 없음";
const quantity = Number(quantityInput);
const safeQuantity = Number.isNaN(quantity) ? 0 : quantity;
const totalPrice = unitPrice * safeQuantity;

const discountRate = originalPrice === 0
  ? 0
  : discountedPrice / originalPrice;
```

## Verification rule

- 경계값이 가능한 데이터 출처인지 확인합니다.
- 계산이나 렌더링 결과가 깨지는지 확인합니다.
- 상위 보장이나 도메인 제약이 있으면 suppress합니다.
- 사용자에게 보이는 오류나 잘못된 값이면 publish 후보로 둡니다.

## PN 기준

공통 리뷰 정책은 [Review Policy](../../Policy.md)를 따릅니다. 아래 내용은 이 rule의 적용 예시입니다.

- `P1`: 경계값에서 주요 화면이 즉시 크래시합니다.
- `P2`: 흔한 빈 상태나 실패 상태에서 주요 화면/행동이 깨지거나 사용자가 다음 행동을 못 합니다.
- `P3`: 경계값 처리가 없어 잘못된 값이 보이지만 보조 표시값이거나 영향이 제한적입니다.
- `P4`: 더 좋은 empty UX 제안입니다.
- `P5`: 빈 상태 문구나 디자인에 대한 낮은 강도의 의견입니다.
