---
id: readability/top-to-bottom/user-policy
title: 시점 이동 줄이기
ruleType: bad_good
category: 가독성
subcategory: 위에서 아래로 읽히게 하기
source: https://frontend-fundamentals.com/code-quality/code/examples/user-policy.html
---

# 시점 이동 줄이기

- 기준 경로: FF › 가독성 › 위에서 아래로 읽히게 하기 › 시점 이동 줄이기
- 원문: https://frontend-fundamentals.com/code-quality/code/examples/user-policy.html

## 원칙
코드를 읽을 때 코드의 위아래를 왔다갔다 하면서 읽거나, 여러 파일이나 함수, 변수를 넘나들면서 읽는 것을 시점 이동 이라고 해요. 시점이 여러 번 이동할수록 코드를 파악하는 데에 시간이 더 걸리고, 맥락을 파악하는 데에 어려움이 있을 수 있어요.
코드를 위에서 아래로, 하나의 함수나 파일에서 읽을 수 있도록 코드를 작성하면, 읽는 사람이 동작을 빠르게 파악할 수 있게 돼요.

## 원본 ❌ 코드 예시
- 다음 코드에서는 사용자의 권한에 따라서 버튼을 다르게 보여줘요.

```tsx
function Page() {
  const user = useUser();
  const policy = getPolicyByRole(user.role);

  return (
    <div>
      <Button disabled={!policy.canInvite}>Invite</Button>
      <Button disabled={!policy.canView}>View</Button>
    </div>
  );
}

function getPolicyByRole(role) {
  const policy = POLICY_SET[role];

  return {
    canInvite: policy.includes("invite"),
    canView: policy.includes("view")
  };
}

const POLICY_SET = {
  admin: ["invite", "view"],
  viewer: ["view"]
};
```

## 원본 코드 냄새 / 판단 근거
- 이 코드에서 Invite 버튼이 비활성화된 이유를 이해하려고 한다면, policy.canInvite → getPolicyByRole(user.role) → POLICY_SET 순으로 코드를 위아래를 오가며 읽어야 해요. 이 과정에서 3번의 시점 이동이 발생해서, 코드를 읽는 사람이 맥락을 유지해 가며 읽기 어려워졌어요.
- POLICY_SET 같은 추상화를 사용해서 권한에 따라 버튼 상태를 관리하는 것은 권한 체계가 복잡한 경우에는 유용할 수 있지만, 지금처럼 간단할 때는 오히려 읽는 사람이 코드를 이해하기 어렵게 만들어요.

## 원본 ✅ 개선 예시
- A. 조건을 펼쳐서 그대로 드러내기
- 권한에 따른 조건을 요구사항 그대로 코드에 드러내는 방법이에요. 이렇게 하면 Invite 버튼이 비활성화되는 때를 코드에서 바로 확인할 수 있어요. 코드를 위에서 아래로만 읽으면 한눈에 권한을 다루는 로직을 파악할 수 있어요.
- B. 조건을 한눈에 볼 수 있는 객체로 만들기
- 권한을 다루는 로직을 컴포넌트 안에서 객체로 관리해서, 여러 차례의 시점 이동 없이 한눈에 조건을 파악할 수 있게 수정할 수 있어요. canInvite 와 canView 의 조건을 Page 컴포넌트만 보면 확인할 수 있어요.

```tsx
function Page() {
  const user = useUser();

  switch (user.role) {
    case "admin":
      return (
        <div>
          <Button disabled={false}>Invite</Button>
          <Button disabled={false}>View</Button>
        </div>
      );
    case "viewer":
      return (
        <div>
          <Button disabled={true}>Invite</Button>
          <Button disabled={false}>View</Button>
        </div>
      );
    default:
      return null;
  }
}
```

```tsx
function Page() {
  const user = useUser();
  const policy = {
    admin: { canInvite: true, canView: true },
    viewer: { canInvite: false, canView: true }
  }[user.role];

  return (
    <div>
      <Button disabled={!policy.canInvite}>Invite</Button>
      <Button disabled={!policy.canView}>View</Button>
    </div>
  );
}
```

## 관찰 가능한 신호
- 정책 조건을 이해하려면 같은 파일의 상수/함수 정의를 여러 번 왕복해야 함
- 핵심 요구사항보다 helper 이름이나 추상화 계층이 먼저 보임
- 조건 조합이 선언 위치와 사용 위치에 흩어져 있음

## 게시 조건
- 핵심 정책을 이해하려면 같은 파일 안에서 여러 상수, 함수, 조건을 오가야 합니다.
- 요구사항의 판단 순서보다 추상화된 이름이나 보조 함수가 먼저 노출됩니다.
- 조건을 펼치거나 재배치하면 위에서 아래로 정책을 따라 읽을 수 있습니다.

## 억제 조건
- 여러 곳에서 공유되는 정책이라 추상화가 더 안전하면 억제합니다.
- 호출부에 펼쳤을 때 오히려 중복과 변경 비용이 커지면 억제합니다.
