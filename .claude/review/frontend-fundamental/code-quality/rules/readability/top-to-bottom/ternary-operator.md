---
id: readability/top-to-bottom/ternary-operator
title: 삼항 연산자 단순하게 하기
ruleType: bad_good
category: 가독성
subcategory: 위에서 아래로 읽히게 하기
source: https://frontend-fundamentals.com/code-quality/code/examples/ternary-operator.html
---

# 삼항 연산자 단순하게 하기

- 기준 경로: FF › 가독성 › 위에서 아래로 읽히게 하기 › 삼항 연산자 단순하게 하기
- 원문: https://frontend-fundamentals.com/code-quality/code/examples/ternary-operator.html

## 원칙
삼항 연산자를 복잡하게 사용하면 조건의 구조가 명확하게 보이지 않아서 코드를 읽기 어려울 수 있어요.

## 원본 ❌ 코드 예시
- 다음 코드는 A조건 과 B조건 에 따라서 "BOTH" , "A" , "B" 또는 "NONE" 중 하나를 status 에 지정하는 코드예요.

```typescript
const status =
  A조건 && B조건 ? "BOTH" : A조건 || B조건 ? (A조건 ? "A" : "B") : "NONE";
```

## 원본 코드 냄새 / 판단 근거
- 이 코드는 여러 삼항 연산자가 중첩되어 사용되어서, 정확하게 어떤 조건으로 값이 계산되는지 한눈에 파악하기 어려워요.

## 원본 ✅ 개선 예시
- 다음과 같이 조건을 if 문으로 풀어서 사용하면 보다 명확하고 간단하게 조건을 드러낼 수 있어요.

```typescript
const status = (() => {
  if (A조건 && B조건) return "BOTH";
  if (A조건) return "A";
  if (B조건) return "B";
  return "NONE";
})();
```

## 관찰 가능한 신호
- 삼항 연산자 안에 다시 삼항 연산자가 들어감
- 삼항 조건이나 결과식에 복합 boolean, JSX, 함수 호출이 포함됨
- 분기별 결과가 한 줄 선택 이상의 처리 흐름을 가짐

## 게시 조건
- 추가/수정된 코드에 중첩 삼항 또는 긴 조건을 가진 삼항 연산자가 있습니다.
- 중첩 삼항이거나 조건/분기 순서가 길어 한눈에 흐름을 따라가기 어렵습니다.
- `if`, 조기 반환, 별도 변수로 바꾸면 분기 흐름이 더 명확해집니다.

## 억제 조건
- 중첩 없는 단일 삼항은 억제합니다.
- 분기 수가 적고 반환값이 짧아 한눈에 읽히면 억제합니다.
