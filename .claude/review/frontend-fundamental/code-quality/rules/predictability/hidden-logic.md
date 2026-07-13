---
id: predictability/hidden-logic
title: 숨은 로직 드러내기
ruleType: bad_good
category: 예측 가능성
source: https://frontend-fundamentals.com/code-quality/code/examples/hidden-logic.html
---

# 숨은 로직 드러내기

- 기준 경로: FF › 예측 가능성 › 숨은 로직 드러내기
- 원문: https://frontend-fundamentals.com/code-quality/code/examples/hidden-logic.html

## 원칙
함수나 컴포넌트의 이름, 파라미터, 반환 값에 드러나지 않는 숨은 로직이 있다면, 함께 협업하는 동료들이 동작을 예측하는 데에 어려움을 겪을 수 있어요.

## 원본 ❌ 코드 예시
- 다음 코드는 사용자의 계좌 잔액을 조회할 때 사용할 수 있는 fetchBalance 함수예요. 함수를 호출할 때마다 암시적으로 balance_fetched 라는 로깅이 이루어지고 있어요.

```typescript
async function fetchBalance(): Promise<number> {
  const balance = await http.get<number>("...");

  logging.log("balance_fetched");

  return balance;
}
```

## 원본 코드 냄새 / 판단 근거
- fetchBalance 함수의 이름과 반환 타입만을 가지고는 balance_fetched 라는 로깅이 이루어지는지 알 수 없어요. 그래서 로깅을 원하지 않는 곳에서도 로깅이 이루어질 수 있어요.
- 또, 로깅 로직에 오류가 발생했을 때 갑자기 계좌 잔액을 가져오는 로직이 망가질 수도 있죠.

## 원본 ✅ 개선 예시
- 함수의 이름과 파라미터, 반환 타입으로 예측할 수 있는 로직만 구현 부분에 남기세요.
- 로깅을 하는 코드는 별도로 분리하세요.

```typescript
async function fetchBalance(): Promise<number> {
  const balance = await http.get<number>("...");

  return balance;
}
```

```tsx
<Button
  onClick={async () => {
    const balance = await fetchBalance();
    logging.log("balance_fetched");

    await syncBalance(balance);
  }}
>
  계좌 잔액 갱신하기
</Button>
```

## 관찰 가능한 신호
- 조회/계산 이름의 함수가 setState, mutate, log, track, navigate, fetch를 수행함
- 함수 호출 한 줄 뒤에 외부 상태나 화면 흐름이 바뀜
- side effect가 함수명이나 반환 타입에 드러나지 않음

## 게시 조건
- 이름상 조회나 계산처럼 보이는 함수가 로깅, 상태 변경, API 호출 같은 side effect를 함께 수행합니다.
- 호출부만 봐서는 실행 결과로 무엇이 바뀌는지 예측하기 어렵습니다.
- 숨은 동작을 이름에 드러내거나 별도 단계로 분리하면 실행 흐름이 명확해집니다.

## 억제 조건
- 원본 나쁜 예와 구조적으로 유사하지 않으면 억제합니다.
- 좋은 예 방향이 이 PR의 실제 맥락에 도움이 된다고 보기 어려우면 억제합니다.
- 단순 취향 또는 팀 컨벤션 충돌 가능성이 크면 summary_only 또는 suppress로 낮춥니다.
