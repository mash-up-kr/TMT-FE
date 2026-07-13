# 보안 기초 위반

## 목적

민감정보 노출, XSS, open redirect, 권한 판단 오류처럼 기본적인 보안 리스크를 잡습니다.

## 관찰 가능한 신호

- token, password, secret, 개인정보를 로그나 클라이언트 저장소에 둡니다.
- 사용자 입력 HTML을 `innerHTML` 또는 `dangerouslySetInnerHTML`로 렌더링합니다.
- 사용자 입력 URL로 redirect하거나 새 창을 엽니다.
- 사용자 입력을 query string, redirect URL, 새 창 URL에 인코딩이나 allowlist 없이 삽입합니다.
- 클라이언트 값만으로 권한을 결정합니다.

## 게시 조건

- 위험이 추가/수정 라인과 직접 연결됩니다.
- 실제 사용자 입력이나 민감정보가 관련됩니다.
- 보안 사고 가능성이 이론적 일반론을 넘습니다.
- sanitize, encodeURIComponent, allowlist, server-side check, logging 제거 등 완화 방법이 구체적입니다.

## 억제 조건

- 값이 더미 데이터나 테스트 fixture입니다.
- 이미 sanitize된 값을 렌더링한다는 근거가 있습니다.
- 서버에서 최종 권한 검증을 수행하고 클라이언트 코드는 표시용입니다.
- 보안 리스크가 아니라 일반적인 코드 스타일 문제입니다.

## 나쁜 예

```tsx
return <div dangerouslySetInnerHTML={{ __html: userInput }} />;
```

## 좋은 예

```tsx
return <div>{userInput}</div>;
```

## 추가 예시: query parameter 인코딩

### 나쁜 예

```ts
const response = await fetch(`/api/cart?userId=${userId}`);
```

### 좋은 예

```ts
const response = await fetch(`/api/cart?userId=${encodeURIComponent(userId)}`);
```

## Verification rule

- 입력 출처가 사용자, URL, API, 저장소 중 하나인지 확인합니다.
- sanitize, allowlist, server-side validation 근거를 찾습니다.
- 민감정보가 로그/스토리지/URL로 나가는지 확인합니다.
- query parameter에 들어가는 사용자 입력은 `encodeURIComponent`나 URLSearchParams로 인코딩되는지 확인합니다.
- 실제 악용 가능성이 보이면 publish 후보로 둡니다.

## PN 기준

공통 리뷰 정책은 [Review Policy](../../Policy.md)를 따릅니다. 아래 내용은 이 rule의 적용 예시입니다.

- `P1`: 민감정보 노출, XSS, 권한 우회가 즉시 가능합니다.
- `P2`: 공격 경로와 사용자 영향이 구체적이라 보안 취약점으로 이어질 가능성이 큽니다.
- `P3`: 보안 방어가 부족하지만 실제 악용이나 사용자 영향은 추가 조건을 일부 추론해야 합니다.
- `P4`: 방어적 개선입니다.
- `P5`: 보안과 직접 관련 없는 질문입니다. 게시하지 않습니다.
