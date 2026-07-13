# API 응답 계약 검증

## 목적

서버, SDK, 외부 모듈이 반환하는 값을 검증 없이 신뢰해서 생기는 결함을 잡습니다.

## 관찰 가능한 신호

- `await res.json()` 결과를 타입 검증 없이 바로 사용합니다.
- 응답이 `{ items: [...] }`라고 가정하고 `data.items.map`처럼 접근합니다.
- optional field를 필수값처럼 표시하거나 계산합니다.
- non-2xx 응답과 정상 응답을 같은 흐름으로 처리합니다.

## 게시 조건

- 응답 구조가 깨질 때 런타임 오류, 잘못된 계산, 잘못된 UI 표시로 이어집니다.
- 추가/수정 코드 안에 검증, fallback, schema parse가 없습니다.
- API 계약이 PR 본문이나 주변 코드에서 명확히 보장되지 않습니다.
- `Array.isArray`, schema parser, field fallback 등 수정 방향이 명확합니다.

## 억제 조건

- typed client, generated API client, zod/io-ts 등으로 이미 검증됩니다.
- 서버와 클라이언트가 같은 schema를 공유하고 해당 경로가 명확합니다.
- mock/demo 코드라 실제 API 실패를 다루는 범위가 아닙니다.
- 문제를 제기하려면 API 스펙을 추측해야 합니다.

## 나쁜 예

```ts
const res = await fetch("/api/cart");
const data = await res.json();
return data.items.map(toCartItem);
```

## 좋은 예

```ts
const res = await fetch("/api/cart");
if (!res.ok) {
  throw new Error("장바구니를 불러오지 못했어요");
}
const data = await res.json();
const items = Array.isArray(data?.items) ? data.items : [];
return items.map(toCartItem);
```

## Verification rule

- 응답값의 최초 사용 지점을 찾습니다.
- 검증 없이 배열/객체 메서드나 필드 접근을 하는지 확인합니다.
- generated client나 schema validation이 있으면 suppress합니다.
- 실패 시 사용자 영향이 있으면 publish 후보로 둡니다.

## PN 기준

공통 리뷰 정책은 [Review Policy](../../Policy.md)를 따릅니다. 아래 내용은 이 rule의 적용 예시입니다.

- `P1`: 잘못된 응답이 데이터 손상, 결제/권한 오류 같은 중대한 문제로 이어집니다.
- `P2`: 흔한 API 실패나 누락 필드에서 주요 화면/기능이 깨지거나 잘못된 데이터가 저장·전파됩니다.
- `P3`: 응답 검증이 없어 실제 문제 가능성은 높지만 영향이 보조 UI, 제한된 입력, 일부 추론 맥락에 머뭅니다.
- `P4`: 방어적 개선이지만 영향 범위가 작습니다.
- `P5`: API 계약에 대한 질문만 있는 경우입니다. 게시하지 않습니다.
