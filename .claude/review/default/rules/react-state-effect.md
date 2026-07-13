# React 상태와 effect 결함

## 목적

React 상태, effect, memoization, cleanup 관련 결함으로 인해 무한 렌더, stale value, 잘못된 UI 상태가 생기는 문제를 잡습니다.

## 관찰 가능한 신호

- `useEffect` dependency가 실제 참조 값과 맞지 않습니다.
- effect 안에서 상태를 바꾸며 같은 상태가 dependency에 있어 루프 가능성이 있습니다.
- cleanup이 필요한 subscription, timer, request가 정리되지 않습니다.
- `useMemo`/`useCallback`이 stale closure를 만듭니다.

## 게시 조건

- React 런타임 동작상 실제 버그로 이어지는 경로가 보입니다.
- 단순 exhaustive-deps 취향이 아니라 사용자 상태나 side effect에 영향이 있습니다.
- 수정 범위가 현재 컴포넌트나 hook 안에서 명확합니다.
- 추가/수정 라인에 원인이 있습니다.

## 억제 조건

- lint가 이미 강제하고 있어 별도 리뷰 가치가 낮습니다.
- dependency 제외가 의도이고 주석이나 ref 패턴으로 설명되어 있습니다.
- memoization 성능 취향에 가깝습니다.
- 실제 렌더 경로와 무관한 예시 코드입니다.

## 나쁜 예

```tsx
useEffect(() => {
  setFiltered(items.filter((item) => item.category === category));
}, [items]);
```

## 좋은 예

```tsx
useEffect(() => {
  setFiltered(items.filter((item) => item.category === category));
}, [items, category]);
```

## Verification rule

- effect, memo, callback 내부에서 참조하는 값과 dependency를 비교합니다.
- 누락이 실제 stale state 또는 잘못된 side effect로 이어지는지 확인합니다.
- 의도적 제외 근거가 있으면 suppress합니다.
- 사용자 동작으로 재현 가능한 상태 불일치가 있으면 publish 후보로 둡니다.

## PN 기준

공통 리뷰 정책은 [Review Policy](../../Policy.md)를 따릅니다. 아래 내용은 이 rule의 적용 예시입니다.

- `P1`: 무한 렌더나 즉시 크래시가 발생할 수 있습니다.
- `P2`: 실제 사용자 동작에서 잘못된 데이터나 상태가 주요 화면/행동에 표시됩니다.
- `P3`: stale state나 cleanup 누락으로 버그 가능성은 높지만 영향이 제한적이거나 특정 타이밍에 머뭅니다.
- `P4`: 안정성 보강이지만 영향이 제한적입니다.
- `P5`: lint/style 취향입니다. 게시하지 않습니다.
