---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# Architecture Rules

## 적용과 정본

- 새 라우트·기능·모듈, 상태 소유권, import 방향, API·storage, dependency 또는 layer를 바꾸는 작업은 구현 전에 이 문서 전체를 읽는다.
- 실제 `src/` 구조, `package.json`, 실행 가능한 설정이 이 문서와 다르면 실제 코드를 정본으로 보고 차이를 명시한다.
- 이 문서에 없는 계층이나 추상화가 필요하면 임의로 추가하지 말고 요구사항과 대안을 먼저 보고한다.

## 핵심 규칙

1. 기능·라우트 구현 코드는 `src/app/{route}/_*/`에서 시작한다.
2. 라우트 전용 코드가 두 곳 이상에서 쓰이면 `src/shared/` 승격을 검토한다.
3. import는 라우트 → shared 단방향이다.
4. 전역 provider, 스타일 토큰, 도메인 무관 UI primitive는 처음부터 정해진 `shared/` 계층에 둘 수 있다.
5. 빈 segment 폴더를 미리 만들지 않는다. 첫 파일이 생기는 시점에 만든다.
6. `features/` 같은 별도 기능 계층을 만들지 않는다.

## 허용 구조

아직 존재하지 않는 segment도 포함한 배치 지도다. 실제 폴더는 첫 파일이 생길 때만 만든다.

```text
src/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx
│   └── {route}/
│       ├── page.tsx
│       ├── _components/
│       ├── _hooks/
│       ├── _utils/
│       ├── _model/
│       ├── _constants/
│       └── _stores/
└── shared/
    ├── ui/
    ├── hooks/
    ├── utils/
    ├── model/
    ├── constants/
    ├── stores/
    ├── styles/
    └── providers/
```

- `_`로 시작하는 폴더는 Next.js 라우트에서 제외된다. 라우트 전용 코드는 해당 라우트의 private segment에 둔다.
- `app/globals.css`는 root layout에서만 import한다. 토큰, reset, theme 파일은 `shared/styles/`가 소유한다.

## 라우트 Private Segment

| Segment | 책임 | 금지 |
|---|---|---|
| `_components/` | 페이지 UI와 페이지 내부 재사용 | 다른 라우트에서 직접 import |
| `_hooks/` | 라우트 범위 상태, side effect, 데이터 조합 | 여러 라우트가 쓰는 범용 hook |
| `_utils/` | 순수 변환, formatter, parser | 타입과 컴포넌트 선언 |
| `_model/` | 라우트 한정 타입과 schema | 함수와 formatter 선언 |
| `_constants/` | 라우트 한정 상수와 enum | 전역 경로와 외부 URL |
| `_stores/` | 라우트 범위 atom/store | 여러 라우트가 공유하는 상태 |

- 단일 컴포넌트 전용 타입과 variant는 컴포넌트 파일에 둔다. 여러 컴포넌트가 공유할 때만 `_model/`로 옮긴다.

## Shared Segment

| Segment | 책임 | 제약 |
|---|---|---|
| `shared/ui/` | 디자인 시스템과 도메인 무관 UI primitive | 라우트, API 응답, store에 직접 의존하지 않는다. |
| `shared/hooks/` | 도메인 무관 범용 hook | 라우트를 import하지 않는다. |
| `shared/utils/` | 순수 함수와 외부 SDK adapter | 라우트를 import하지 않는다. |
| `shared/model/` | 전역 도메인 타입 | 실제 전역 의미가 있을 때만 둔다. |
| `shared/constants/` | 라우트 경로, 외부 URL, 전역 상수 | 라우트 전용 값을 올리지 않는다. |
| `shared/stores/` | 여러 라우트가 공유하는 상태 | 구체적인 공유 요구가 있을 때만 추가한다. |
| `shared/styles/` | 토큰, reset, theme | 사용 방식은 design-system rule을 따른다. |
| `shared/providers/` | 전역 Context provider | `app/`을 import하지 않는다. |

- 도메인 의미가 있는 UI는 라우트에 유지한다. 실제 재사용이 확인되고 props를 도메인 무관하게 만들 수 있을 때만 `shared/ui/`로 승격한다.

## Import 경계

```text
app/{route}/  →  shared/{ui, hooks, utils, model, constants, stores, styles, providers}
```

- 허용: 라우트 → shared, 같은 라우트의 private segment 간 import.
- 금지: shared → app, 라우트 간 직접 import, 다른 라우트의 private segment import.
- 라우트 group 전용 코드는 `app/(group)/_*/`에 둔다.

## 코드 배치 절차

1. API 연동이 필요한가: 아래 API·Mock 도입 계약을 먼저 따른다.
2. 한 라우트에서만 쓰는가: 해당 라우트의 private segment에 둔다.
3. 여러 라우트에서 쓰는가: UI는 `shared/ui/`, hook은 `shared/hooks/`, 순수 함수와 SDK adapter는 `shared/utils/`를 검토한다.
4. 전역 타입·상수·상태·provider인가: 실제 전역 의미나 여러 라우트의 공유 요구가 있을 때만 해당 shared segment로 옮긴다.
5. 어느 분류에도 맞지 않는가: 새 계층을 만들지 말고 가장 가까운 라우트에 둔 뒤 다음 실제 사용처에서 재검토한다.

## 현재 상태

- 서버 상태는 `src/shared/providers/QueryProvider.tsx`를 통한 react-query를 사용한다.
- `zustand`는 설치되어 있지만 여러 라우트가 공유하는 상태 요구가 확인되기 전에는 전역 store를 만들지 않는다.
- `src/api/`, orval, `pnpm api-gen`, MSW는 아직 도입되지 않았다.

## API·Mock 도입 계약

아래는 합의된 목표 계약이며 아직 구현된 현재 구조가 아니다. API 또는 Mock 구현 요청을 받으면 구현 대신 dependency, generation command, configuration, migration scope를 포함한 도입안을 작성하고 승인을 요청한다. 승인 전에는 `src/api/`, 수동 API client, 라우트별 fetch wrapper, mock layer를 만들지 않는다.

도입이 승인되면 다음 구조와 책임을 함께 구현한다.

- OpenAPI와 orval로 client, hook, schema, MSW handler를 `src/api/gen/`에 생성하고 직접 수정하지 않는다.
- endpoint 변경은 OpenAPI를 수정한 뒤 `pnpm api-gen`으로 반영한다.
- `src/api/mutator.ts`는 플랫폼 `fetch`를 사용하며 인증, 공통 header, 공통 에러 처리를 소유한다.
- API 응답을 UI model로 바꾸는 코드는 라우트 `_utils/`에 둔다.
- MSW 인프라와 custom scenario는 `src/api/mock/`에서 관리하고 생성 handler와 분리한다.
- 페이지와 라우트 private segment에는 mock handler를 만들지 않는다.
- MSW는 `NEXT_PUBLIC_API_MOCKING`으로 활성화한다.
- orval 없는 수동 client, 수동 MSW handler, API와 Mock의 부분 도입을 대안으로 제안하지 않는다. 목표 계약을 바꾸려면 구현 전에 이 규칙을 먼저 합의해 수정한다.
- 최초 API 또는 Mock 도입안의 migration scope에는 위 항목 전체를 포함하며, 개별 endpoint의 필요성을 이유로 일부 제외 여부를 다시 묻지 않는다.

도입 변경에서 dependency, `pnpm api-gen`, orval/MSW 설정, 환경 변수, 생성 파일 정책을 실제 코드와 함께 추가하고 이 문서의 현재 상태를 갱신한다.

## 재검토 기준

`shared/` 비대화, 같은 도메인 코드의 라우트 간 반복, import 방향 위반, server/client 경계 문제가 반복되면 이 규칙을 재검토하고 구조 변경을 PR에서 합의한다.
