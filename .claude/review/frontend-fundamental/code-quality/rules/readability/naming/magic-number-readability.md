---
id: readability/naming/magic-number-readability
title: 매직 넘버에 이름 붙이기
ruleType: bad_good
category: 가독성
subcategory: 이름 붙이기
source: https://frontend-fundamentals.com/code-quality/code/examples/magic-number-readability.html
---

# 매직 넘버에 이름 붙이기

- 기준 경로: FF › 가독성 › 이름 붙이기 › 매직 넘버에 이름 붙이기
- 원문: https://frontend-fundamentals.com/code-quality/code/examples/magic-number-readability.html

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
- 이 코드는 delay 함수에 전달된 300 이라고 하는 값이 어떤 맥락으로 쓰였는지 알 수 없어요. 원래 코드를 작성한 개발자가 아니라면, 어떤 목적으로 300ms동안 기다리는지 알 수 없죠.
- 하나의 코드를 여러 명의 개발자가 함께 수정하다 보면 의도를 정확히 알 수 없어서 코드가 원하지 않는 방향으로 수정될 수도 있어요.
- INFO
- 이 함수는 응집도 관점으로도 볼 수 있어요.

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
- 함수 인자, 계산식, timeout, limit, size 등에 숫자 리터럴이 직접 들어감
- 숫자의 단위나 정책 의미가 변수명/함수명에서 드러나지 않음
- 같은 숫자가 아니더라도 도메인 기준값으로 보이는 숫자가 추가됨

## 게시 조건
- 추가/수정된 숫자 리터럴의 단위나 정책 의미가 코드만 보고 드러나지 않습니다.
- 상수명으로 바꾸면 숫자의 도메인 의미, 단위, 기준을 설명할 수 있습니다.
- 배열 인덱스나 boolean 변환처럼 관용적으로 자명한 숫자가 아닙니다.

## 억제 조건
- 배열 인덱스 0/1, 100% 등 문맥상 자명한 수는 억제합니다.
- HTTP status도 `HTTP_STATUS.NOT_FOUND`처럼 의미가 이미 이름으로 드러나면 억제합니다.
- 테스트 데이터나 데모 값처럼 도메인 정책값이 아니면 낮춥니다.
