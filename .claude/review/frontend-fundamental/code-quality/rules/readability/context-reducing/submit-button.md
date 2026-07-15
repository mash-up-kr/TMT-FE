---
id: readability/context-reducing/submit-button
title: 같이 실행되지 않는 코드 분리하기
ruleType: bad_good
category: 가독성
subcategory: 맥락 줄이기
source: https://frontend-fundamentals.com/code-quality/code/examples/submit-button.html
---

# 같이 실행되지 않는 코드 분리하기

- 기준 경로: FF › 가독성 › 맥락 줄이기 › 같이 실행되지 않는 코드 분리하기
- 원문: https://frontend-fundamentals.com/code-quality/code/examples/submit-button.html

## 원칙
동시에 실행되지 않는 코드가 하나의 함수 또는 컴포넌트에 있으면, 동작을 한눈에 파악하기 어려워요. 구현 부분에 많은 숫자의 분기가 들어가서, 어떤 역할을 하는지 이해하기 어렵기도 해요.

## 원본 ❌ 코드 예시
- 다음 <SubmitButton /> 컴포넌트는 사용자의 권한에 따라서 다르게 동작해요.

```tsx
function SubmitButton() {
  const isViewer = useRole() === "viewer";

  useEffect(() => {
    if (isViewer) {
      return;
    }
    showButtonAnimation();
  }, [isViewer]);

  return isViewer ? (
    <TextButton disabled>Submit</TextButton>
  ) : (
    <Button type="submit">Submit</Button>
  );
}
```

## 원본 코드 냄새 / 판단 근거
- <SubmitButton /> 컴포넌트에서는 사용자가 가질 수 있는 2가지의 권한 상태를 하나의 컴포넌트 안에서 한 번에 처리하고 있어요. 그래서 코드를 읽는 사람이 한 번에 고려해야 하는 맥락이 많아요.
- 예를 들어, 다음 코드에서 파란색은 사용자가 보기 전용 권한( 'viewer' )을 가지고 있을 때, 빨간색은 일반 사용자일 때 실행되는 코드예요. 동시에 실행되지 않는 코드가 교차되어서 나타나서 코드를 이해할 때 부담을 줘요.

## 원본 ✅ 개선 예시
- 다음 코드는 사용자가 보기 전용 권한을 가질 때와 일반 사용자일 때를 완전히 나누어서 관리하도록 하는 코드예요.

```tsx
function SubmitButton() {
  const isViewer = useRole() === "viewer";

  return isViewer ? <ViewerSubmitButton /> : <AdminSubmitButton />;
}

function ViewerSubmitButton() {
  return <TextButton disabled>Submit</TextButton>;
}

function AdminSubmitButton() {
  useEffect(() => {
    showButtonAnimation();
  }, []);

  return <Button type="submit">Submit</Button>;
}
```

## 관찰 가능한 신호
- role/mode/status 값에 따라 JSX 루트나 주요 UI가 달라짐
- 특정 분기에서만 실행되는 useEffect, handler, API 호출이 같은 컴포넌트에 있음
- 분기별 코드가 ternary/if 안에서 서로 교차되어 배치됨

## 게시 조건
- 추가/수정된 코드에 상호배타적인 role, mode, status 분기가 있습니다.
- 분기마다 UI 구조, effect, handler 중 하나 이상이 다르게 실행됩니다.
- 분리했을 때 각 컴포넌트나 함수가 자기 분기만 설명하게 되어 읽을 맥락이 줄어듭니다.

## 억제 조건
- 분기가 사소하고 className, label, icon 정도만 다르면 억제합니다.
- 분리했을 때 props 전달과 파일 이동이 더 복잡해지면 억제합니다.
