# 캐시 일관성 유지

## 목적

서버 상태와 클라이언트 캐시가 어긋나 사용자에게 오래된 데이터나 잘못된 상태를 보여주는 문제를 잡습니다.

## 관찰 가능한 신호

- mutation 후 관련 query를 invalidate/refetch하지 않습니다.
- query key가 필터, 사용자 id, 페이지 번호 같은 실제 파라미터를 포함하지 않습니다.
- optimistic update가 실패했을 때 rollback이 없습니다.
- local state, cache, server response가 같은 데이터를 따로 관리하지만 동기화 규칙이 없습니다.
- 캐시 갱신 범위가 너무 좁거나 넓어 다른 화면에 영향을 줄 수 있습니다.
- 캐시 key나 버전 비교가 실제 데이터 구분 기준과 다르게 구성됩니다.

## 게시 조건

- PR 안이나 주변 코드에서 같은 데이터의 읽기/쓰기 경로가 확인됩니다.
- 변경 후 사용자가 stale data, 잘못된 count, 사라지지 않는 항목, 되돌아오는 상태를 볼 가능성이 있습니다.
- query key 수정, invalidate/refetch, optimistic rollback, cache update 범위 조정처럼 구체적인 수정 방향이 있습니다.
- 캐시 문제가 추가/수정 라인과 직접 연결됩니다.
- 캐시 key에 빠진 파라미터나 버전 값이 실제로 서로 다른 서버 응답을 구분한다는 근거가 있습니다.

## 억제 조건

- 프레임워크나 mutation helper가 자동 invalidation을 보장합니다.
- 화면이 즉시 이동하거나 reload되어 stale cache가 사용자에게 노출되지 않습니다.
- 데이터가 read-only이거나 캐시 일관성보다 성능을 의도적으로 우선한 근거가 있습니다.
- 캐시 계층을 추측해야만 문제를 제기할 수 있습니다.
- 버전 값이나 snapshot timestamp가 환경/플랫폼별로 실제로 달라지는지 diff만으로 확인할 수 없습니다.
- 캐시 key 후보는 보이지만, 같은 key로 서로 다른 데이터가 사용자에게 노출되는 경로가 확인되지 않습니다.

## 나쁜 예

```ts
await updateCartItem(itemId, quantity);
toast.success("수량을 변경했어요");
```

## 좋은 예

```ts
await updateCartItem(itemId, quantity);
await queryClient.invalidateQueries({ queryKey: ["cart"] });
toast.success("수량을 변경했어요");
```

## Verification rule

- mutation이 어떤 서버 상태를 바꾸는지 확인합니다.
- 같은 서버 상태를 읽는 query/cache key가 있는지 확인합니다.
- invalidate, refetch, direct cache update, optimistic rollback 중 하나가 있는지 확인합니다.
- 캐시 key나 버전 비교 문제는 누락된 값이 실제 응답을 구분하는 값인지 확인합니다.
- 자동 처리 근거가 없고 stale data가 사용자에게 보이면 publish 후보로 둡니다.
- 응답 버전이 항상 같을 수 있거나 사용자 노출 경로가 불명확하면 verifier에서 suppress합니다.

## PN 기준

공통 리뷰 정책은 [Review Policy](../../Policy.md)를 따릅니다. 아래 내용은 이 rule의 적용 예시입니다.

- `P1`: 캐시 불일치가 결제, 권한, 데이터 손상 같은 중대한 결과로 이어집니다.
- `P2`: 흔한 사용자 흐름에서 오래된 데이터나 잘못된 상태가 주요 화면에 계속 보이거나 저장·전파됩니다.
- `P3`: mutation 후 관련 화면의 일관성이 깨질 가능성은 높지만 영향이 제한된 화면이나 회복 가능한 상태에 머뭅니다.
- `P4`: UX 정확도를 높이는 선택적 캐시 보강입니다.
- `P5`: 캐시 전략에 대한 질문이나 취향입니다. 게시하지 않습니다.
