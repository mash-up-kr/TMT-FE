---
id: readability/naming/condition-name
title: 복잡한 조건에 이름 붙이기
ruleType: bad_good
category: 가독성
subcategory: 이름 붙이기
source: https://frontend-fundamentals.com/code-quality/code/examples/condition-name.html
---

# 복잡한 조건에 이름 붙이기

- 기준 경로: FF › 가독성 › 이름 붙이기 › 복잡한 조건에 이름 붙이기
- 원문: https://frontend-fundamentals.com/code-quality/code/examples/condition-name.html

## 원칙
복잡한 조건식이 특별한 이름 없이 사용되면, 조건이 뜻하는 바를 한눈에 파악하기 어려워요.

## 원본 ❌ 코드 예시
- 다음 코드는 상품 중에서 카테고리와 가격 범위가 일치하는 상품만 필터링하는 로직이에요.

```typescript
const result = products.filter((product) =>
  product.categories.some(
    (category) =>
      category.id === targetCategory.id &&
      product.prices.some((price) => price >= minPrice && price <= maxPrice)
  )
);
```

## 원본 코드 냄새 / 판단 근거
- 이 코드에서는 익명 함수와 조건이 복잡하게 얽혀 있어요. filter 와 some , && 같은 로직이 여러 단계로 중첩되어 있어서 정확한 조건을 파악하기 어려워졌어요.
- 코드를 읽는 사람이 한 번에 고려해야 하는 맥락이 많아서, 가독성이 떨어져요. [1]

## 원본 ✅ 개선 예시
- 다음 코드와 같이 조건에 명시적인 이름을 붙이면, 코드를 읽는 사람이 한 번에 고려해야 할 맥락을 줄일 수 있어요.
- 명시적으로 같은 카테고리 안에 속해 있고, 가격 범위가 맞는 제품들로 필터링한다고 작성함으로써, 복잡한 조건식을 따라가지 않고도 코드의 의도를 명확히 드러낼 수 있어요.

```typescript
const matchedProducts = products.filter((product) => {
  return product.categories.some((category) => {
    const isSameCategory = category.id === targetCategory.id;
    const isPriceInRange = product.prices.some(
      (price) => price >= minPrice && price <= maxPrice
    );

    return isSameCategory && isPriceInRange;
  });
});
```

## 관찰 가능한 신호
- filter/some/every/find 콜백 안에 복합 boolean 조건이 직접 들어감
- `&&`, `||`, `!`가 섞인 조건이 이름 없이 if/return에 들어감
- 조건식 안에 도메인 정책값이나 상태 비교가 2개 이상 포함됨

## 게시 조건
- 추가/수정된 조건식에 `&&`, `||`, `!`, `some`, `every`, `filter` 등이 겹쳐 의미를 한눈에 알기 어렵습니다.
- 조건에 이름을 붙이면 정책이나 도메인 의미가 더 선명해집니다.
- 이름 붙인 값이 한 번만 쓰이더라도 읽는 사람이 조건의 목적을 바로 이해할 수 있습니다.

## 억제 조건
- 단순한 표현식이나 한눈에 읽히는 조건은 억제합니다.
- 이름을 붙여도 의미가 더 선명해지지 않으면 억제합니다.
