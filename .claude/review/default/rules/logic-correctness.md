# 조건과 상태 전이 일치

## 목적

조건 이름, 반환 상태, 분기 결과가 서로 반대로 연결되어 실제 동작이 의도와 다르게 흐르는 결함을 잡습니다.

## 관찰 가능한 신호

- `has*`, `can*`, `is*`처럼 긍정 조건이 모두 참인데 `blocked`, `disabled`, `error` 같은 실패 상태를 반환합니다.
- 성공 조건과 실패 조건의 반환값이 뒤집혀 있습니다.
- 타입이나 상태 이름은 `ready | blocked | submitted`처럼 의미가 분명한데 분기 결과가 그 의미와 맞지 않습니다.
- `>`/`>=`, `<`/`<=`, `&&`/`||`, 부정 조건 때문에 경계값이나 상태 전이가 반대로 동작합니다.

## 게시 조건

- 추가/수정 라인에서 조건과 결과의 의미가 직접 충돌합니다.
- 변수명, 타입 이름, 반환값 이름, PR 설명 중 하나 이상이 기대 흐름을 뒷받침합니다.
- 수정 방향이 조건 반전, 반환값 교체, 상태명 정리처럼 좁고 명확합니다.
- 실제 사용자 흐름에서 잘못된 상태, 잘못된 버튼 활성화, 잘못된 단계 이동으로 이어질 수 있습니다.

## 억제 조건

- 상태명이나 조건명이 도메인 특수 용어라 반대로 보이는 이유가 주변 코드에 명확합니다.
- PR 설명이나 테스트에서 의도적으로 반대 흐름을 구현한다고 설명합니다.
- 단순히 변수명을 더 좋게 바꾸자는 취향에 가깝습니다.
- 문제를 말하려면 제품 정책을 추측해야 합니다.

## 나쁜 예

```ts
function nextStep(input: CheckoutInput): CheckoutStep {
  const hasAddress = input.address.trim().length > 0;
  const hasItems = input.items.length > 0;

  if (hasAddress && hasItems) {
    return "blocked";
  }

  return "ready";
}
```

## 좋은 예

```ts
function nextStep(input: CheckoutInput): CheckoutStep {
  const hasAddress = input.address.trim().length > 0;
  const hasItems = input.items.length > 0;

  if (!hasAddress || !hasItems) {
    return "blocked";
  }

  return "ready";
}
```

## Verification rule

- 조건명과 반환값/상태명의 의미를 같이 확인합니다.
- 타입 union, enum, PR 설명, 주변 테스트가 기대 흐름을 뒷받침하는지 확인합니다.
- 같은 조건의 반대 분기가 이미 처리되는지 확인합니다.
- 단순 가독성 문제가 아니라 실제 결과가 뒤집히면 publish 후보로 둡니다.

## PN 기준

공통 리뷰 정책은 [Review Policy](../../Policy.md)를 따릅니다. 아래 내용은 이 rule의 적용 예시입니다.

- `P1`: 결제, 권한, 데이터 삭제 같은 주요 행동의 허용/차단이 반대로 동작합니다.
- `P2`: 현실적인 사용자 경로에서 주요 단계 진행, 저장, 제출 가능 여부가 반대로 판단됩니다.
- `P3`: 잘못된 상태 전이 가능성이 높지만 영향이 보조 UI나 제한된 흐름에 머뭅니다.
- `P4`: 상태명/조건명이 헷갈려 유지보수 리스크가 있지만 즉시 결함은 불명확합니다.
- `P5`: 네이밍이나 표현에 대한 낮은 강도의 의견입니다.
