# 비동기 동시성 결함

## 목적

요청 순서 역전, 중복 제출, stale response, unmount 이후 상태 갱신처럼 비동기 작업이 겹치며 생기는 결함을 잡습니다.

## 관찰 가능한 신호

- 검색어나 필터 변경마다 요청을 보내지만 이전 요청을 취소하거나 최신 요청인지 확인하지 않습니다.
- 저장/결제/제출 버튼이 pending 중에도 다시 눌릴 수 있습니다.
- 비동기 응답이 도착하면 무조건 현재 상태를 덮어씁니다.
- 컴포넌트 unmount 이후에도 `setState`가 실행될 수 있습니다.
- 순서가 중요한 작업을 `Promise.all`이나 병렬 호출로 실행하면서 충돌 방어가 없습니다.

## 게시 조건

- 사용자 동작, 네트워크 지연, 빠른 입력으로 실제 순서 역전이나 중복 실행이 가능합니다.
- 최신 요청 식별, `AbortController`, pending guard, idempotency key, debounce/throttle 중 필요한 방어가 없습니다.
- 잘못된 UI 상태, 중복 저장, 이전 데이터 표시, 중복 결제/요청 같은 영향이 있습니다.
- 추가/수정 라인과 직접 연결됩니다.

## 억제 조건

- 라이브러리가 stale response 무시, cancellation, deduplication을 이미 보장합니다.
- 작업이 idempotent이고 중복 실행되어도 사용자 영향이 없습니다.
- read-only telemetry나 로그처럼 순서가 중요하지 않습니다.
- 동시성 문제가 아니라 단순 에러 처리 누락에 가깝습니다.

## 나쁜 예

```tsx
useEffect(() => {
  fetch(`/api/search?q=${query}`)
    .then((res) => res.json())
    .then(setResults);
}, [query]);
```

## 좋은 예

```tsx
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/search?q=${query}`, { signal: controller.signal })
    .then((res) => res.json())
    .then(setResults)
    .catch((error) => {
      if (error.name === "AbortError") return;

      // 팀의 에러 로깅/알림 정책에 맞게 처리합니다.
      logError(error);
    });

  return () => controller.abort();
}, [query]);
```

## Verification rule

- 같은 상태를 갱신하는 비동기 작업이 동시에 여러 번 실행될 수 있는지 확인합니다.
- 응답 순서가 바뀌면 오래된 결과가 최신 UI를 덮는지 확인합니다.
- pending guard, abort, request id, idempotency key, debounce/throttle 같은 방어가 있으면 suppress합니다.
- 사용자 영향이 실제로 보이면 publish 후보로 둡니다.

## PN 기준

공통 리뷰 정책은 [Review Policy](../../Policy.md)를 따릅니다. 아래 내용은 이 rule의 적용 예시입니다.

- `P1`: 중복 결제, 데이터 손상, 권한 변경처럼 되돌리기 어려운 결과로 이어집니다.
- `P2`: 흔한 사용자 동작에서 중복 저장, 잘못된 화면, stale data가 주요 흐름에 노출됩니다.
- `P3`: 네트워크 지연이나 빠른 입력에서 상태가 꼬일 가능성은 높지만 영향이 제한적이거나 특정 타이밍에 머뭅니다.
- `P4`: 방어적 개선이지만 영향이 제한적입니다.
- `P5`: 성능 취향이나 구현 스타일에 가까운 낮은 강도의 의견입니다.
