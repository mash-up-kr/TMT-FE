---
id: readability/context-reducing/login-start-page
title: 구현 상세 추상화하기
ruleType: bad_good
category: 가독성
subcategory: 맥락 줄이기
source: https://frontend-fundamentals.com/code-quality/code/examples/login-start-page.html
---

# 구현 상세 추상화하기

- 기준 경로: FF › 가독성 › 맥락 줄이기 › 구현 상세 추상화하기
- 원문: https://frontend-fundamentals.com/code-quality/code/examples/login-start-page.html

## 원칙
한 사람이 코드를 읽을 때 동시에 고려할 수 있는 총 맥락의 숫자는 제한되어 있다고 해요. 내 코드를 읽는 사람들이 코드를 쉽게 읽을 수 있도록 하기 위해서 불필요한 맥락을 추상화할 수 있어요.

## 원본 ❌ 코드 예시
- 다음 <LoginStartPage /> 컴포넌트는 사용자가 로그인되었는지 확인하고, 로그인이 된 경우 홈으로 이동시키는 로직을 가지고 있어요.
- 다음 <FriendInvitation /> 컴포넌트는 클릭하면 사용자에게 동의를 받고 사용자에게 초대를 보내는 페이지 컴포넌트예요.

```tsx
function LoginStartPage() {
  useCheckLogin({
    onChecked: (status) => {
      if (status === "LOGGED_IN") {
        location.href = "/home";
      }
    }
  });

  /* ... 로그인 관련 로직 ... */

  return <>{/* ... 로그인 관련 컴포넌트 ... */}</>;
}
```

```tsx
function FriendInvitation() {
  const { data } = useQuery(/* 생략.. */);

  // 이외 이 컴포넌트에 필요한 상태 관리, 이벤트 핸들러 및 비동기 작업 로직...

  const handleClick = async () => {
    const canInvite = await overlay.openAsync(({ isOpen, close }) => (
      <ConfirmDialog
        title={`${data.name}님에게 공유해요`}
        cancelButton={
          <ConfirmDialog.CancelButton onClick={() => close(false)}>
            닫기
          </ConfirmDialog.CancelButton>
        }
        confirmButton={
          <ConfirmDialog.ConfirmButton onClick={() => close(true)}>
            확인
          </ConfirmDialog.ConfirmButton>
        }
        /* 중략 */
      />
    ));

    if (canInvite) {
      await sendPush();
    }
  };

  // 이외 이 컴포넌트에 필요한 상태 관리, 이벤트 핸들러 및 비동기 작업 로직...

  return (
    <>
      <Button onClick={handleClick}>초대하기</Button>
      {/* UI를 위한 JSX 마크업... */}
    </>
  );
}
```

## 원본 코드 냄새 / 판단 근거
- 예시 코드에서는 로그인이 되었는지 확인하고, 사용자를 홈으로 이동시키는 로직이 추상화 없이 노출되어 있어요. 그래서 useCheckLogin , onChecked , status , "LOGGED_IN" 과 같은 변수나 값을 모두 읽어야 무슨 역할을 하는 코드인지 알 수 있어요.
- 이 코드와 더불어서, 실제로 로그인과 관련된 코드가 밑에 이어지는데요. 읽는 사람이 LoginStartPage 가 무슨 역할을 하는지 알기 위해서 한 번에 이해해야 하는 맥락이 많아요.
- 가독성을 지키려면 코드가 한 번에 가지고 있는 맥락이 적어야 해요. 하나의 컴포넌트가 가지고 있는 맥락이 다양하면 컴포넌트의 역할을 한눈에 파악하기 어려워져요.
- <FriendInvitation /> 컴포넌트는 실제로 사용자에게 동의를 받을 때 사용하는 자세한 로직까지 하나의 컴포넌트에 가지고 있어요. 그래서 코드를 읽을 때 따라가야 할 맥락이 많아서 읽기 어려워요.
- 사용자에게 동의를 받는 로직과 실제로 그 로직을 실행하는 로직인 <Button /> 사이에 거리가 멀어서, 실제로 어디에서 이 로직을 실행하는지 확인하려면 스크롤을 밑으로 많이 내려야 해요.
- 그래서 자주 함께 수정되는 코드인 버튼과 클릭 핸들러가 미처 함께 수정되지 못할 가능성이 있어요.

## 원본 ✅ 개선 예시
- 사용자가 로그인되었는지 확인하고 이동하는 로직을 HOC(Higher-Order Component) 나 Wrapper 컴포넌트로 분리하여, 코드를 읽는 사람이 한 번에 알아야 하는 맥락을 줄여요. 그래서 코드의 가독성을 높일 수 있어요.
- 또한, 분리된 컴포넌트 안에 있는 로직끼리 참조를 막음으로써, 코드 간의 불필요한 의존 관계가 생겨서 복잡해지는 것을 막을 수 있어요.
- 사용자에게 동의를 받는 로직과 버튼을 <InviteButton /> 컴포넌트로 추상화했어요.
- <InviteButton /> 컴포넌트는 사용자를 초대하는 로직과 UI만 가지고 있으므로, 한 번에 인지해야 하는 내용을 적게 유지해서 가독성을 높일 수 있어요. 또한, 버튼과 클릭 후 실행되는 로직이 아주 가까이에 있어요.

```tsx
function App() {
  return (
    <AuthGuard>
      <LoginStartPage />
    </AuthGuard>
  );
}

function AuthGuard({ children }) {
  const status = useCheckLoginStatus();

  useEffect(() => {
    if (status === "LOGGED_IN") {
      location.href = "/home";
    }
  }, [status]);

  return status !== "LOGGED_IN" ? children : null;
}

function LoginStartPage() {
  /* ... 로그인 관련 로직 ... */

  return <>{/* ... 로그인 관련 컴포넌트 ... */}</>;
}
```

```tsx
function LoginStartPage() {
  /* ... 로그인 관련 로직 ... */

  return <>{/* ... 로그인 관련 컴포넌트 ... */}</>;
}

export default withAuthGuard(LoginStartPage);

// HOC 정의
function withAuthGuard(WrappedComponent) {
  return function AuthGuard(props) {
    const status = useCheckLoginStatus();

    useEffect(() => {
      if (status === "LOGGED_IN") {
        location.href = "/home";
      }
    }, [status]);

    return status !== "LOGGED_IN" ? <WrappedComponent {...props} /> : null;
  };
}
```

```tsx
export function FriendInvitation() {
  const { data } = useQuery(/* 생략.. */);

  // 이외 이 컴포넌트에 필요한 상태 관리, 이벤트 핸들러 및 비동기 작업 로직...

  return (
    <>
      <InviteButton name={data.name} />
      {/* UI를 위한 JSX 마크업 */}
    </>
  );
}

function InviteButton({ name }) {
  return (
    <Button
      onClick={async () => {
        const canInvite = await overlay.openAsync(({ isOpen, close }) => (
          <ConfirmDialog
            title={`${name}님에게 공유해요`}
            cancelButton={
              <ConfirmDialog.CancelButton onClick={() => close(false)}>
                닫기
              </ConfirmDialog.CancelButton>
            }
            confirmButton={
              <ConfirmDialog.ConfirmButton onClick={() => close(true)}>
                확인
              </ConfirmDialog.ConfirmButton>
            }
            /* 중략 */
          />
        ));

        if (canInvite) {
          await sendPush();
        }
      }}
    >
      초대하기
    </Button>
  );
}
```

## 관찰 가능한 신호
- 페이지 컴포넌트에 인증, 라우팅, 다이얼로그, API 흐름이 직접 나열됨
- 사용자 행동 이름보다 구현 단계 이름이 호출부에 먼저 드러남
- 동일 화면에서 UI 렌더링과 비즈니스 절차가 긴 블록으로 섞임

## 게시 조건
- 페이지나 화면 컴포넌트에 인증, 이동, 다이얼로그, API 흐름 같은 구현 상세가 직접 노출됩니다.
- 추상화했을 때 호출부가 사용자 흐름을 더 직접적으로 읽히게 됩니다.
- 새 이름이 구현을 숨기는 데 그치지 않고 도메인 의도를 드러냅니다.

## 억제 조건
- 한 번만 쓰이는 단순 로직을 이름만 바꿔 감추는 경우는 억제합니다.
- 추상화 때문에 실제 조건을 찾는 시점 이동이 더 늘어나면 억제합니다.
