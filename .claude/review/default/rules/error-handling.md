# 에러 처리 누락

## 목적

비동기 실패, 파싱 실패, 요청 실패가 사용자에게 잘못된 성공 상태로 보이거나 조용히 사라지는 문제를 잡습니다.
로컬 `try/catch`를 강제하지는 않으며, instance, query layer, router action, error boundary 등 어디에서 실패를 처리하는지 추적 가능해야 합니다.

## 관찰 가능한 신호

- `fetch`, `axios`, async function 호출에 실패 흐름이 없습니다.
- `res.ok` 확인 없이 JSON을 파싱합니다.
- catch에서 에러를 삼키고 사용자 상태를 바꾸지 않습니다.
- 실패해도 성공 UI나 캐시 갱신이 계속됩니다.

## 게시 조건

- 실패가 실제 사용자 동작이나 데이터 일관성에 영향을 줍니다.
- 상위 error boundary나 query client가 처리한다는 근거가 없습니다.
- 실패 상태, 재시도, 사용자 메시지, throw 중 하나로 수정 방향이 명확합니다.
- 추가/수정 라인에 실패 흐름 누락이 직접 있습니다.

## 억제 조건

- React Query, SWR, router action 등 상위 프레임워크가 실패 상태를 관리합니다.
- fire-and-forget telemetry처럼 실패를 무시하는 것이 의도입니다.
- catch 후 로깅만 해도 충분한 비사용자 경로입니다.
- 실패 처리 방식이 팀 정책 문제라 diff만으로 판단할 수 없습니다.

## 나쁜 예

```ts
await fetch("/api/profile", {
  method: "POST",
  body: JSON.stringify(profile),
});
setSaved(true);
```

## 좋은 예

```ts
const res = await fetch("/api/profile", {
  method: "POST",
  body: JSON.stringify(profile),
});
if (!res.ok) {
  setError("프로필 저장에 실패했어요");
  return;
}
setSaved(true);
```

## Verification rule

- 비동기 호출의 결과가 성공 여부와 연결되는지 확인합니다.
- 실패했을 때 사용자 상태, 로그, throw 중 하나가 있는지 확인합니다.
- 상위 공통 처리 레이어가 있으면 suppress합니다.
- 실패가 성공 상태로 표시되면 publish 후보로 둡니다.

## PN 기준

공통 리뷰 정책은 [Review Policy](../../Policy.md)를 따릅니다. 아래 내용은 이 rule의 적용 예시입니다.

- `P1`: 실패를 성공으로 처리해 데이터 손상이나 잘못된 결제가 발생할 수 있습니다.
- `P2`: 실패 응답에서 주요 기능이 깨지거나 잘못된 상태가 저장·전파됩니다.
- `P3`: 실패 경로가 누락되어 사용자 혼란이나 운영 디버깅 비용이 생기지만 주요 흐름 실패까지는 직접 보이지 않습니다.
- `P4`: UX 개선 성격의 에러 메시지 보강입니다.
- `P5`: 에러 문구 취향입니다. 게시하지 않습니다.
