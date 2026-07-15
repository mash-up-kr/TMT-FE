---
id: predictability/http
title: 이름 겹치지 않게 관리하기
ruleType: bad_good
category: 예측 가능성
source: https://frontend-fundamentals.com/code-quality/code/examples/http.html
---

# 이름 겹치지 않게 관리하기

- 기준 경로: FF › 예측 가능성 › 이름 겹치지 않게 관리하기
- 원문: https://frontend-fundamentals.com/code-quality/code/examples/http.html

## 원칙
같은 이름을 가지는 함수나 변수는 동일한 동작을 해야 해요. 작은 동작 차이가 코드의 예측 가능성을 낮추고, 코드를 읽는 사람에게 혼란을 줄 수 있어요.

## 원본 ❌ 코드 예시
- 어떤 프론트엔드 서비스에서 원래 사용하던 HTTP 라이브러리를 감싸서 새로운 형태로 HTTP 요청을 보내는 모듈을 만들었어요. 공교롭게 원래 HTTP 라이브러리와 새로 만든 HTTP 모듈의 이름은 http 로 같아요.

```typescript
// 이 서비스는 `http`라는 라이브러리를 쓰고 있어요
import { http as httpLibrary } from "@some-library/http";

export const http = {
  async get(url: string) {
    const token = await fetchToken();

    return httpLibrary.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};
```

```typescript
// http.ts에서 정의한 http를 가져오는 코드
import { http } from "./http";

export async function fetchUser() {
  return http.get("...");
}
```

## 원본 코드 냄새 / 판단 근거
- 이 코드는 기능적으로 문제가 없지만, 읽는 사람에게 혼란을 줄 수 있어요. http.get 을 호출하는 개발자는 이 함수가 원래의 HTTP 라이브러리가 하는 것처럼 단순한 GET 요청을 보내는 것으로 예상하지만, 실제로는 토큰을 가져오는 추가 작업이 수행돼요.
- 오해로 인해서 기대 동작과 실제 동작의 차이가 생기고, 버그가 발생하거나, 디버깅 과정을 복잡하고 혼란스럽게 만들 수 있어요.

## 원본 ✅ 개선 예시
- 서비스에서 만든 함수에는 라이브러리의 함수명과 구분되는 명확한 이름을 사용해서 함수의 동작을 예측 가능하게 만들 수 있어요.
- 이렇게 해서 함수의 이름을 봤을 때 동작을 오해할 수 있는 가능성을 줄일 수 있어요. 다른 개발자가 이 함수를 사용할 때, 서비스에서 정의한 함수라는 것을 인지하고 올바르게 사용할 수 있어요.
- 또한, getWithAuth 라는 이름으로 이 함수가 인증된 요청을 보낸다는 것을 명확하게 전달할 수 있어요.

```typescript
// 이 서비스는 `http`라는 라이브러리를 쓰고 있어요
import { http as httpLibrary } from "@some-library/http";

// 라이브러리 함수명과 구분되도록 명칭을 변경했어요.
export const httpService = {
  async getWithAuth(url: string) {
    const token = await fetchToken();

    // 토큰을 헤더에 추가하는 등 인증 로직을 추가해요.
    return httpLibrary.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};
```

```typescript
// httpService.ts에서 정의한 httpService를 가져오는 코드
import { httpService } from "./httpService";

export async function fetchUser() {
  // 함수명을 통해 이 함수가 인증된 요청을 보내는 것을 알 수 있어요.
  return await httpService.getWithAuth("...");
}
```

## 관찰 가능한 신호
- `get`, `fetch`, `http` 계열 이름의 함수 내부에 인증/로깅/변환이 함께 있음
- 함수 이름보다 넓은 책임이 wrapper 안에 숨겨짐
- 호출부에서 에러 처리나 응답 shape를 이름만으로 예측하기 어려움

## 게시 조건
- `get`, `fetch`, `http`처럼 익숙한 이름의 함수가 이름에서 예상하기 어려운 부가 동작을 수행합니다.
- 인증, 로깅, 에러 변환, 응답 변환 같은 숨은 책임이 호출부에서 드러나지 않습니다.
- 이름을 바꾸거나 책임을 분리하면 호출자가 동작을 더 정확히 예측할 수 있습니다.

## 억제 조건
- 원본 나쁜 예와 구조적으로 유사하지 않으면 억제합니다.
- 좋은 예 방향이 이 PR의 실제 맥락에 도움이 된다고 보기 어려우면 억제합니다.
- 단순 취향 또는 팀 컨벤션 충돌 가능성이 크면 summary_only 또는 suppress로 낮춥니다.
