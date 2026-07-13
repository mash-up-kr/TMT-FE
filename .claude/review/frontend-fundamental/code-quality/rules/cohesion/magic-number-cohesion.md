---
id: cohesion/magic-number-cohesion
title: 매직 넘버 없애기
ruleType: bad_good
category: 응집도
source: https://frontend-fundamentals.com/code-quality/code/examples/magic-number-cohesion.html
---

# 매직 넘버 없애기

- 기준 경로: FF › 응집도 › 매직 넘버 없애기
- 원문: https://frontend-fundamentals.com/code-quality/code/examples/magic-number-cohesion.html

## 원칙
매직 넘버 (Magic Number)란 정확한 뜻을 밝히지 않고 소스 코드 안에 직접 숫자 값을 넣는 것을 말해요.
예를 들어, 찾을 수 없음(Not Found)을 나타내는 HTTP 상태 코드로 404 값을 바로 사용하는 것이나, 하루를 나타내는 86400 초를 그대로 사용하는 것이 있어요.

## 원본 ❌ 코드 예시
- 다음 코드는 좋아요 버튼을 눌렀을 때 좋아요 개수를 새로 내려받는 함수예요.

```typescript
async function onLikeClick() {
  await postLike(url);
  await delay(300);
  await refetchPostLike();
}
```

## 원본 코드 냄새 / 판단 근거
- 300 이라고 하는 숫자를 애니메이션 완료를 기다리려고 사용했다면, 재생하는 애니메이션을 바꿨을 때 조용히 서비스가 깨질 수 있는 위험성이 있어요. 충분한 시간동안 애니메이션을 기다리지 않고 바로 다음 로직이 시작될 수도 있죠.
- 같이 수정되어야 할 코드 중 한쪽만 수정된다는 점에서, 응집도가 낮은 코드라고도 할 수 있어요.
- INFO
- 이 함수는 가독성 관점으로도 볼 수 있어요.

## 원본 ✅ 개선 예시
- 숫자 300 의 맥락을 정확하게 표시하기 위해서 상수 ANIMATION_DELAY_MS 로 선언할 수 있어요.

```typescript
const ANIMATION_DELAY_MS = 300;

async function onLikeClick() {
  await postLike(url);
  await delay(ANIMATION_DELAY_MS);
  await refetchPostLike();
}
```

## 관찰 가능한 신호
- 동일하거나 같은 의미의 숫자 정책값이 여러 위치에 반복됨
- 반복 숫자가 서로 다른 파일이나 컴포넌트에 흩어져 있음
- 값 변경 시 함께 바뀌어야 할 코드가 여러 곳에 있음

## 게시 조건
- 같은 의미의 숫자나 정책값이 여러 파일 또는 여러 위치에 반복됩니다.
- 값을 바꿀 때 함께 수정해야 할 지점이 흩어져 있습니다.
- 상수나 설정으로 모으면 변경 단위가 하나로 응집됩니다.

## 억제 조건
- 원본 나쁜 예와 구조적으로 유사하지 않으면 억제합니다.
- 좋은 예 방향이 이 PR의 실제 맥락에 도움이 된다고 보기 어려우면 억제합니다.
- 단순 취향 또는 팀 컨벤션 충돌 가능성이 크면 summary_only 또는 suppress로 낮춥니다.
