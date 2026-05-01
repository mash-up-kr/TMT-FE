# Frontend Architecture

| 항목 | 값 |
|------|-----|
| Status | Active |
| Version | 1.2 |
| Scope | `ttalkkak-web` |
| Stack | Next.js App Router |
| Last updated | 2026-05-01 |

---

## 1. 목적과 범위

`ttalkkak-web` 레포의 코드 구조 컨벤션. Next.js App Router 사이드 프로젝트 기준.

페이지 응집도를 우선해 "어디 둘지" 고민을 줄이고, 두 곳 이상에서 쓰일 때만 위로 끌어올린다.

API는 orval 자동생성(§5), features 폴더 미사용, PR 리뷰로 합의 유지.

---

## 2. 핵심 원칙

세 가지 규칙. 외운다.

1. **모든 코드는 라우트 폴더 안에서 시작한다.** (`app/{route}/_*/`)
2. **두 곳 이상에서 쓰이면 위로 승격한다.** (페이지 → `shared/`)
3. **import는 위에서 아래로만 흐른다.** (route → shared, 역방향 금지)

> 이 세 줄로 안 풀리는 케이스가 생기면 그때 규칙을 추가하라. 지금은 추가하지 않는다.

---

## 3. 폴더 구조

```
src/
├── api/                              # orval 자동생성. 수정 금지. (§5 참조)
│   ├── gen/
│   │   ├── posts/
│   │   ├── users/
│   │   └── auth/
│   └── mutator.ts
│
├── app/                              # Next.js App Router. 라우트별 폴더만.
│   ├── layout.tsx
│   ├── page.tsx                      # /
│   │
│   ├── home/                         # /home
│   │   ├── page.tsx
│   │   ├── _components/
│   │   ├── _hooks/
│   │   ├── _utils/
│   │   ├── _model/
│   │   ├── _constants/
│   │   └── _stores/
│   │
│   └── users/[id]/
│       ├── page.tsx
│       └── _components/
│
└── shared/                           # 라우트 밖에서 쓰는 모든 것
    ├── ui/
    ├── hooks/
    ├── utils/
    ├── model/
    ├── constants/
    ├── stores/
    └── providers/
```

### 3.1 언더스코어 폴더 컨벤션

Next.js App Router는 **`_`로 시작하는 폴더를 라우트에서 제외**한다.
즉 `app/home/_components/` 안의 파일은 URL로 노출되지 않는다. 이 메커니즘 덕에 페이지 코드를 라우트 폴더에 같이 둘 수 있다.

### 3.2 빈 폴더 정책

표준 segment라도 **파일이 없으면 폴더를 만들지 않는다.** 첫 파일이 생기는 시점에 폴더 생성. 빈 폴더 양산 방지.

---

## 4. Segment 명세

각 폴더의 책임을 정의. 분류가 모호하면 이 표가 정답.

### 4.1 페이지 전용 segment

| Segment | 라벨 | 책임 | 예시 |
|---------|------|------|------|
| `_components/` | 표준 | 페이지 UI 분해 / 페이지 내 재사용 | `PostsView.tsx`, `PostCard.tsx` |
| `_hooks/` | 표준, 필요 시 | 페이지 스코프 상태, side effect, fetching 래퍼 | `usePostsQuery.ts`, `usePostsFilter.ts` |
| `_utils/` | 표준, 필요 시 | 순수 함수, 변환, 포맷터, 파서 | `toPostViewModel.ts`, `formatPostDate.ts` |
| `_model/` | 표준, 필요 시 | 페이지 한정 타입, zod 스키마 | `post.types.ts`, `post.schema.ts` |
| `_constants/` | 표준, 필요 시 | 페이지 한정 상수, enum | `post.const.ts` |
| `_stores/` | 선택 | 페이지 스코프 atoms/store | `post.atoms.ts` |

> **`_model/` vs `@/api/gen/`**: 백엔드 API 응답 타입은 `@/api/gen/`이 자동생성. `_model/`은 폼 검증, 클라이언트 전용 가공 타입(예: `PostViewModel`)에 한정.

### 4.2 공유 segment

| Segment | 라벨 | 책임 | 예시 |
|---------|------|------|------|
| `shared/ui/` | 표준, 필요 시 | 디자인 시스템 + 라우트-무관 UI (도메인 데이터 받지 않음) | `Button.tsx`, `Header.tsx` |
| `shared/hooks/` | 표준, 필요 시 | 도메인 무관 범용 훅 | `useDebounce`, `useMediaQuery` |
| `shared/utils/` | 표준, 필요 시 | 순수 함수, 외부 SDK 어댑터 | `formatDate`, `supabase.ts` |
| `shared/model/` | 선택 | 전역 도메인 타입 (API gen에 없는 것만) | `User`, `Session` |
| `shared/constants/` | 선택 | 라우트 경로, 외부 URL, 매직값 | `ROUTES`, `EXTERNAL_LINKS` |
| `shared/stores/` | 선택 | 전역 atoms/store | `auth.atoms.ts` |
| `shared/providers/` | 선택 | Context Providers | `QueryClientProvider`, `ThemeProvider` |

> **표준, 필요 시**: 표준 segment 이름이지만 첫 파일이 등장할 때 폴더 생성 (§3.2).
> **선택**: 해당 패턴(전역 상태, Context 등)이 처음 등장하는 시점에 폴더 생성.

---

## 5. API 생성 정책

API 클라이언트 코드는 **개발자가 직접 작성하지 않는다.** 백엔드 서버가 제공하는 Swagger(OpenAPI) 스펙을 기반으로 `pnpm api-gen` 명령어를 실행해 자동생성한다.

### 5.1 구조

```
src/api/
├── gen/                   # orval 출력. 도메인별 hooks/types/clients
│   ├── posts/
│   │   ├── posts.ts       # useGetPosts, useCreatePost 등
│   │   └── posts.schemas.ts
│   ├── users/
│   └── auth/
└── mutator.ts             # 인증 헤더, 인터셉터, 에러 핸들링
```

### 5.2 규칙

| 항목 | 정책 |
|------|------|
| `src/api/gen/` 직접 편집 | 금지 (재생성 시 덮어쓰임) |
| 신규 엔드포인트 추가 | OpenAPI 스펙 변경 후 `pnpm api-gen` 재생성 |
| 커스텀 헤더/인증/에러 | `src/api/mutator.ts`에서 처리 |
| 페이지 전용 axios 인스턴스 | 금지 (모든 호출은 mutator 경유) |
| API 응답 가공 | 페이지 `_utils/toXxxViewModel.ts`에서 |

### 5.3 사용 패턴

```ts
// app/posts/page.tsx (RSC)
import { getPosts } from '@/api/gen/posts/posts';

export default async function Page() {
  const posts = await getPosts();
  return <PostsView posts={posts} />;
}

// app/posts/_components/PostsView.tsx (Client)
'use client';
import { useGetPosts } from '@/api/gen/posts/posts';

export function PostsView() {
  const { data } = useGetPosts();
  // ...
}
```

### 5.4 Mock 서버 (MSW)

API mock도 orval과 짝을 이뤄 `src/api/` 아래에서 관리한다. 별도 `shared/mocks/`나 `src/mocks/`는 만들지 않는다.

```
src/api/
├── gen/
│   ├── posts/
│   │   ├── posts.ts
│   │   ├── posts.schemas.ts
│   │   └── posts.msw.ts        # orval이 OpenAPI에서 자동생성한 MSW 핸들러
│   └── ...
├── mutator.ts
└── mock/                        # MSW 인프라 (수동 작성)
    ├── handlers.ts              # gen의 *.msw.ts들을 모아 export
    ├── handlers.override.ts     # 특정 시나리오/에러 모킹 (수동)
    ├── browser.ts               # MSW worker (브라우저)
    └── server.ts                # MSW server (테스트/SSR)

public/
└── mockServiceWorker.js         # MSW CLI가 강제하는 위치
```

#### 규칙

| 항목 | 정책 |
|------|------|
| `*.msw.ts` (gen 내부) | orval 자동생성. 직접 편집 금지 |
| 커스텀 시나리오/에러 응답 | `mock/handlers.override.ts`에서 정의 |
| 페이지 코드에서 mock handler 직접 작성 | 금지 (모든 mock은 `src/api/mock/`에) |
| 활성화 | env flag(`NEXT_PUBLIC_API_MOCKING`)로 토글 |

#### 사용 패턴

```ts
// src/api/mock/handlers.ts
import { getPostsMSW } from '../gen/posts/posts.msw';
import { getUsersMSW } from '../gen/users/users.msw';
import { overrides } from './handlers.override';

export const handlers = [
  ...getPostsMSW(),
  ...getUsersMSW(),
  ...overrides,        // 커스텀이 자동생성을 덮어씀
];

// app/_mock-init.tsx (또는 layout.tsx에서 dynamic import)
if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  import('@/api/mock/browser').then(({ worker }) => worker.start());
}
```

---

## 6. Import 규칙

### 6.1 방향

```
app/{route}/  →  shared/{ui, hooks, utils, model, ...}
              →  @/api/gen/...                       (orval 자동생성)
```

- ✅ route → shared
- ✅ route → `@/api/gen/...`
- ✅ 라우트 자기 자신의 `_*` 폴더끼리 자유
- ❌ shared → app
- ❌ 라우트 간 직접 (`app/home` ↔ `app/users`)
- ❌ 다른 라우트의 `_*` 폴더 직접 import
- ❌ `src/api/gen/` 직접 수정 (자동생성 영역)

### 6.2 라우트 그룹

Next.js의 라우트 그룹 `(group)/` 활용 가능. 그룹 한정 컴포넌트는 `app/(marketing)/_components/`에 둘 수 있음.

---

## 7. 코드 배치 Decision Tree

```
새 코드 작성 →

Q0. API 호출인가?
 └─ Yes → @/api/gen/...에서 import (직접 작성 금지, §5)
 └─ No → Q1

Q1. 한 페이지에서만 쓰나?
 ├─ Yes → app/{route}/_components | _hooks | _utils | _model | _constants | _stores/
 │         (분류는 §4.1 참조)
 └─ No → Q2

Q2. 어떤 종류인가? (분류는 §4.2 참조)
 ├─ UI 부품 (도메인 무관)         → shared/ui/
 ├─ UI + 도메인 (예: PostCard)    → 일단 복사 유지, 정말 공통화되면 도메인 props로 일반화 후 shared/ui/
 ├─ 범용 훅                       → shared/hooks/
 ├─ 순수 함수/어댑터              → shared/utils/
 ├─ 전역 도메인 타입              → shared/model/
 ├─ 전역 상태                     → shared/stores/
 ├─ Context Provider              → shared/providers/
 └─ 상수/경로/외부 URL            → shared/constants/
```

---

## 8. 안티패턴

다음 패턴은 리뷰에서 구조 조정을 요청한다.

| 안티패턴 | 왜 안 됨 | 대신 |
|----------|---------|------|
| 처음부터 `shared/`에 둠 | 사용처 1개 = 추상화 근거 없음 | 페이지 안에서 시작 |
| 라우트끼리 직접 import | 페이지 경계 깨짐 | 공유분은 `shared/`로 승격 |
| `shared/`에서 `app/` import | 의존성 역방향 | 반대로 뒤집기 |
| 도메인 데이터 받는 컴포넌트를 `shared/ui/`에 | ui는 도메인 무관 약속 | 페이지 내부 또는 props로 도메인 일반화 |
| 단일 사용 코드를 `shared/`에 미리 둠 | 잘못된 추상화 | 두 번째 사용 시 승격 |
| `_utils/`에 타입 선언 | utils는 행동 전용 | `_model/`로 |
| `_model/`에 함수 선언 | model은 데이터 형태 전용 | `_utils/`로 |
| 상수를 `_utils/` 또는 `_model/`에 | 분류 모호화 | `_constants/`로 |
| 수동으로 axios/fetch 호출 작성 | API 통합 정책 위반 (§5) | `@/api/gen/...`에서 import |
| `src/api/gen/` 직접 편집 | 재생성 시 덮어쓰임 | OpenAPI 스펙 변경 후 `pnpm api-gen` 재생성 |
| 페이지마다 다른 axios 인스턴스 생성 | 인터셉터/인증 분산 | `src/api/mutator.ts` 한 곳에서 관리 |
| 페이지 코드/컴포넌트에서 MSW handler 작성 | mock 분산, API 변경 시 추적 어려움 | `src/api/mock/handlers.override.ts`에서 관리 |
| `*.msw.ts` (gen 내부) 직접 편집 | 재생성 시 덮어쓰임 | `mock/handlers.override.ts`에서 덮어쓰기 |
| 도메인 슬라이스(features/) 폴더 만들기 | 본 아키텍처 미사용 | 페이지 내부 segment로 분류 |

---

## 9. 재검토 기준

본 구조는 사이드 프로젝트 규모 가정으로 설계되었다. 다음 조건 중 **하나라도** 발생하면 구조를 재검토한다.

- 페이지가 30개 이상이 된다
- `shared/`가 catch-all로 비대해지기 시작한다
- 같은 도메인 코드가 여러 라우트에 반복 등장한다
- import 방향 위반이 PR에서 반복 지적된다
- server/client 경계 문제가 반복된다

재검토 시 검토 대상: 자동 검증 도구(ESLint boundaries, dependency-cruiser) 도입, `features/` 도입, 도메인 grouping 추가 등.
