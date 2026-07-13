---
id: readability/top-to-bottom/comparison-order
title: 왼쪽에서 오른쪽으로 읽히게 하기
ruleType: bad_good
category: 가독성
subcategory: 위에서 아래로 읽히게 하기
source: https://frontend-fundamentals.com/code-quality/code/examples/comparison-order.html
---

# 왼쪽에서 오른쪽으로 읽히게 하기

- 기준 경로: FF › 가독성 › 위에서 아래로 읽히게 하기 › 왼쪽에서 오른쪽으로 읽히게 하기
- 원문: https://frontend-fundamentals.com/code-quality/code/examples/comparison-order.html

## 원칙
범위를 확인하는 조건문에서 부등호의 순서가 자연스럽지 않으면, 코드를 읽는 사람이 조건의 의도를 파악하는 데 시간이 더 걸려요.

## 원본 ❌ 코드 예시
- 다음 코드들은 값이 특정 범위 안에 있는지 확인하는 조건문이에요.

```typescript
if (a >= b && a <= c) {
  ...
}

if (score >= 80 && score <= 100) {
  console.log("우수");
}

if (price >= minPrice && price <= maxPrice) {
  console.log("적정 가격");
}
```

## 원본 코드 냄새 / 판단 근거
- 이 코드들은 논리적으로는 올바르지만, 읽을 때 자연스럽지 않아요. a >= b && a <= c 처럼 작성하면 중간값인 a 를 두 번 확인해야 해서, 코드를 읽는 사람이 조건을 이해하기 위해 더 많은 인지적 부담을 느껴요.
- 수학에서 범위를 표현할 때처럼 b ≤ a ≤ c 형태로 왼쪽에서 오른쪽으로 자연스럽게 읽히면 더 직관적이에요.

## 원본 ✅ 개선 예시
- 다음과 같이 범위의 시작점부터 끝점까지 왼쪽에서 오른쪽으로 읽히는 순서로 조건을 작성하면, 코드를 읽는 사람이 범위를 한눈에 파악할 수 있어요.
- 이렇게 작성하면 80 ≤ score ≤ 100 , minPrice ≤ price ≤ maxPrice 처럼 수학의 부등식과 같은 형태로 읽혀서, 코드를 읽는 사람이 범위 조건을 직관적으로 이해할 수 있어요.

```typescript
if (b <= a && a <= c) {
  ...
}

if (80 <= score && score <= 100) {
  console.log("우수");
}

if (minPrice <= price && price <= maxPrice) {
  console.log("적정 가격");
}
```

## 관찰 가능한 신호
- 같은 변수가 부등호 양쪽에 반복되어 범위를 표현함
- `a < x && x < b` 형태로 읽히지 않고 비교 방향이 섞임
- 비교 대상과 기준값의 좌우 위치가 조건마다 다름

## 게시 조건
- 범위 비교에서 같은 대상 변수가 양쪽에 반복되거나 부등호 방향이 섞입니다.
- 수학식처럼 왼쪽에서 오른쪽으로 범위가 읽히지 않습니다.
- 비교 순서를 바꾸면 의미는 같고 읽는 방향만 더 자연스러워집니다.

## 억제 조건
- 팀 컨벤션이 이미 반대 방향이면 억제합니다.
- 취향에 가까운 규칙이므로 publish하더라도 suggestion을 넘기지 않습니다.
