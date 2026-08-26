# UI Preview Index Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/preview`에서 구현된 UI 프리뷰를 찾고, `/preview/profile` 한 화면에서 프로필의 그룹·좋아요·티켓 기본/빈 상태를 전환해 확인할 수 있게 한다.

**Architecture:** `/preview/page.tsx`는 사람이 관리하는 작은 링크 목록만 소유한다. 각 기능 프리뷰는 PR #58의 패턴처럼 실제 표시 컴포넌트에 타입이 지정된 fixture를 주입하고, 프레임 바깥의 상태 전환기로 시나리오를 바꾸며 API 요청은 실행하지 않는다.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4

**Spec:** `docs/profile-flow-design.md`

## Global Constraints

- 새 dependency, 프리뷰 전용 공용 컴포넌트, 파일 시스템 기반 자동 라우트 탐색을 추가하지 않는다.
- 프리뷰는 생성 API hook을 import하거나 네트워크 요청을 실행하지 않는다.
- `src/app/profile/_components`의 실제 표시 컴포넌트와 `src/app/profile/_model/profile.ts`의 타입을 그대로 재사용한다.
- 프리뷰 fixture는 API mock이 아니라 표시 컴포넌트에 전달하는 로컬 ViewModel 값이다.
- 프리뷰 경로는 서비스 공개 경로가 아니므로 `src/shared/constants/routes.ts`에 추가하지 않는다.
- 스타일은 기존 semantic token과 `ds-` spacing/radius token만 사용한다.
- 저장소에는 자동 테스트 명령이 없으므로 `pnpm verify`와 각 URL의 HTTP 200 응답으로 검증한다.

---

## File Map

- Modify: `docs/profile-flow-design.md` — 기존 “프리뷰 금지” 문장을 제한된 표시용 프리뷰 정책으로 교체한다.
- Create: `src/app/preview/profile/page.tsx` — 프로필 6개 시나리오 fixture와 상태 전환 UI를 한 파일에서 소유한다.
- Create: `src/app/preview/page.tsx` — 홈·프로필 프리뷰로 들어가는 수동 인덱스를 제공한다.

프리뷰 전용 fixture나 switcher를 별도 파일/공용 계층으로 분리하지 않는다. 현재 소비자는 각 프리뷰 페이지 하나뿐이고, PR #58과 기존 `src/app/preview/home/page.tsx`도 같은 단일 파일 패턴을 사용한다.

### Task 1: 프로필 설계 문서의 프리뷰 정책 갱신

**Files:**
- Modify: `docs/profile-flow-design.md`의 `4.5 API 계약 전에는 표시 컴포넌트만 선구현한다`
- Test: 없음 — 문서 변경

**Interfaces:**
- Consumes: 현재 표시 컴포넌트 선구현 범위
- Produces: Task 2가 따라야 할 프리뷰 경계

- [ ] **Step 1: 충돌하는 마지막 문단을 제한된 프리뷰 정책으로 교체한다**

아래 문단:

```markdown
선구현 컴포넌트는 생성 API 타입을 import하지 않고 이 문서의 ViewModel만 받는다. 실제 route page는 API 데이터가 없으므로 만들지 않으며, 컴포넌트를 확인하기 위한 임시 preview route·하드코딩 fixture도 만들지 않는다. OpenAPI 계약이 반영되면 Screen과 mapper를 추가해 선구현 컴포넌트를 연결한다.
```

를 다음 내용으로 바꾼다:

```markdown
선구현 컴포넌트는 생성 API 타입을 import하지 않고 이 문서의 ViewModel만 받는다. 실제 profile route page는 API 데이터가 없으므로 만들지 않는다. 대신 `src/app/preview/profile/page.tsx`에서 타입이 지정된 로컬 ViewModel fixture를 표시 컴포넌트에 직접 주입해 기본·빈 상태를 확인한다. 이 preview는 생성 API hook을 import하거나 네트워크 요청을 실행하지 않으며, 서비스 공개 경로와 API mock으로 취급하지 않는다. OpenAPI 계약이 반영되면 Screen과 mapper를 추가해 실제 route를 연결하되, preview는 표시 상태 회귀 확인용으로 유지한다.
```

- [ ] **Step 2: 문서 diff를 확인한다**

Run:

```bash
git diff -- docs/profile-flow-design.md
```

Expected: 기존 금지 문단 한 곳만 바뀌고 API 계약·실제 route 구현 순서는 그대로 유지된다.

- [ ] **Step 3: 문서 변경을 커밋한다**

```bash
git add docs/profile-flow-design.md
git commit -m "docs: 프로필 프리뷰 검증 정책 추가"
```

### Task 2: 단일 프로필 프리뷰 페이지 추가

**Files:**
- Create: `src/app/preview/profile/page.tsx`
- Test: 없음 — 저장소에 테스트 러너가 없다. Task 4에서 route와 빌드를 검증한다.

**Interfaces:**
- Consumes: `ProfilePage`, `GroupList`, `FavoriteList`, `TicketCard`, `TicketHistoryList`, 프로필 ViewModel 타입
- Produces: `GET /preview/profile`, `ProfilePreviewState`

- [ ] **Step 1: 6개 시나리오와 타입 지정 fixture를 선언한다**

파일 상단에 다음 계약을 둔다. 외부 이미지 호스트 대신 이미 설치된 `dummy-image.png`를 사용한다.

```tsx
"use client";

import { useState } from "react";
import dummyImage from "@/shared/assets/dummy-image.png";
import { BottomNav } from "@/shared/ui/BottomNav";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { BlankIcon, ChevronLeftIcon } from "@/shared/ui/Icons";
import { cn } from "@/shared/utils/cn";
import { FavoriteList } from "../../profile/_components/FavoriteList";
import { GroupList } from "../../profile/_components/GroupList";
import { PlaceRecommendationCard } from "../../profile/_components/PlaceRecommendationCard";
import { ProfilePage } from "../../profile/_components/ProfilePage";
import { TicketCard } from "../../profile/_components/TicketCard";
import { TicketHistoryList } from "../../profile/_components/TicketHistoryList";
import type {
  ProfileFavoriteItem,
  ProfileGroupItem,
  ProfileIdentityModel,
  ProfileTicketHistoryItem,
} from "../../profile/_model/profile";

type ProfilePreviewState =
  | "groups"
  | "groups-empty"
  | "favorites"
  | "favorites-empty"
  | "tickets"
  | "tickets-empty";

const SCENARIOS: readonly { key: ProfilePreviewState; label: string }[] = [
  { key: "groups", label: "그룹" },
  { key: "groups-empty", label: "그룹 · 빈 상태" },
  { key: "favorites", label: "좋아요" },
  { key: "favorites-empty", label: "좋아요 · 빈 상태" },
  { key: "tickets", label: "티켓" },
  { key: "tickets-empty", label: "티켓 · 빈 상태" },
];

const PROFILE: ProfileIdentityModel = {
  nickname: "하아얀",
  email: "hayaan@example.com",
  imageUrl: dummyImage.src,
};

const COUNTS = { reviews: 12, groups: 2, favorites: 3 } as const;

const GROUPS: readonly ProfileGroupItem[] = [
  {
    groupId: "group-1",
    name: "마포 맛집 탐험대",
    description: "마포구의 숨은 맛집을 함께 찾아요",
    imageUrl: dummyImage.src,
    matchedSavedPlaceCount: 3,
  },
  {
    groupId: "group-2",
    name: "주말 브런치 모임",
    description: "토요일마다 새로운 브런치 가게를 방문해요",
    imageUrl: null,
    matchedSavedPlaceCount: 0,
  },
];

const FAVORITES: readonly ProfileFavoriteItem[] = [
  {
    placeId: "place-1",
    name: "오즈 커피",
    roadAddress: "서울 마포구 도화길 12",
    categoryName: "카페",
    thumbnailUrl: dummyImage.src,
  },
  {
    placeId: "place-2",
    name: "또간집 식당",
    roadAddress: "서울 마포구 백범로 21",
    categoryName: null,
    thumbnailUrl: null,
  },
];

const TICKETS: readonly ProfileTicketHistoryItem[] = [
  {
    id: "ticket-1",
    status: "draft",
    draftId: "draft-1",
    placeName: "오즈 커피",
    address: "서울 마포구 도화길 12",
  },
  {
    id: "ticket-2",
    status: "settled",
    delta: 1,
    placeName: "또간집 식당",
    address: "서울 마포구 백범로 21",
  },
  {
    id: "ticket-3",
    status: "settled",
    delta: -1,
    placeName: "티켓 사용",
    address: "맛집 추천 받기",
  },
];
```

- [ ] **Step 2: PR #58과 같은 프레임 외부 switcher를 추가한다**

기존 홈 프리뷰와 PR #58의 위치·버튼 스타일을 그대로 복사한다. 공용 `PreviewSwitcher`는 만들지 않는다.

```tsx
const SWITCHER = [
  "fixed top-ds-12 left-ds-12 z-overlay flex w-[168px] flex-col gap-ds-4",
  "min-[431px]:left-auto min-[431px]:right-[calc(50%_+_215px_+_var(--spacing-ds-16))]",
].join(" ");

export default function ProfilePreviewPage() {
  const [state, setState] = useState<ProfilePreviewState>("groups");

  return (
    <>
      <ProfilePreviewContent state={state} />
      <nav aria-label="프로필 프리뷰 상태" className={SWITCHER}>
        {SCENARIOS.map((scenario) => (
          <button
            key={scenario.key}
            type="button"
            onClick={() => setState(scenario.key)}
            className={cn(
              "rounded-ds-xs px-ds-8 py-ds-4 text-left text-body-sm-medium",
              state === scenario.key
                ? "bg-surface-inverse text-content-interactive-inverse"
                : "bg-surface-primary text-content-secondary",
            )}
          >
            {scenario.label}
          </button>
        ))}
      </nav>
    </>
  );
}
```

- [ ] **Step 3: 그룹·좋아요와 티켓 화면 조합을 분리한다**

조건은 페이지 안의 두 조합으로만 둔다. 프리뷰를 위해 production 컴포넌트에 `preview` prop이나 새 slot을 추가하지 않는다.

```tsx
function ProfilePreviewContent({ state }: { state: ProfilePreviewState }) {
  if (state === "tickets" || state === "tickets-empty") {
    return <TicketsPreview empty={state === "tickets-empty"} />;
  }

  const activeTab = state === "groups" || state === "groups-empty" ? "groups" : "favorites";
  const empty = state.endsWith("-empty");

  return (
    <>
      <GNB align="left" title={null} left={<BlankIcon size={28} />} />
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-surface-primary">
        <ProfilePage
          profile={PROFILE}
          activeTab={activeTab}
          basePath="/profile/me"
          counts={COUNTS}
          beforeTabs={
            <>
              <PlaceRecommendationCard href="/preview/profile" />
              <TicketCard count={3} href="/preview/profile" />
            </>
          }
        >
          {activeTab === "groups" ? (
            <GroupList
              groups={empty ? [] : GROUPS}
              getGroupHref={() => "/preview/profile"}
            />
          ) : (
            <FavoriteList
              places={empty ? [] : FAVORITES}
              getPlaceHref={() => "/preview/profile"}
              onUnfavorite={() => {}}
            />
          )}
        </ProfilePage>
      </main>
      <div className="flex shrink-0 justify-center px-ds-20 py-ds-12">
        <BottomNav value="my" onValueChange={() => {}} onCreate={() => {}} />
      </div>
    </>
  );
}

function TicketsPreview({ empty }: { empty: boolean }) {
  return (
    <>
      <GNB
        title="내 티켓"
        left={
          <IconButton aria-label="뒤로 가기">
            <ChevronLeftIcon />
          </IconButton>
        }
      />
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-surface-primary">
        <div className="content-container py-ds-20">
          <TicketCard count={empty ? 0 : 3} />
        </div>
        <div aria-hidden="true" className="h-ds-12 shrink-0 bg-surface-secondary" />
        <TicketHistoryList
          items={empty ? [] : TICKETS}
          getDraftHref={() => "/preview/profile"}
          writeReviewHref="/reviews/new"
        />
      </main>
    </>
  );
}
```

`ProfileTabs`의 링크는 실제 목표 경로(`/profile/me/{tab}`)를 보여주기 위해 `basePath="/profile/me"`를 유지한다. 프리뷰 상태 전환은 프레임 바깥 switcher가 담당하며, 실제 profile route가 생기기 전 탭 링크 클릭 검증은 범위 밖이다.

- [ ] **Step 4: 정적 검사를 실행한다**

Run:

```bash
pnpm check src/app/preview/profile/page.tsx
pnpm typecheck
```

Expected: 두 명령 모두 exit code 0.

- [ ] **Step 5: 프로필 프리뷰를 커밋한다**

```bash
git add src/app/preview/profile/page.tsx
git commit -m "feat: 프로필 UI 프리뷰 추가"
```

### Task 3: 전체 프리뷰 인덱스 추가

**Files:**
- Create: `src/app/preview/page.tsx`
- Test: 없음 — Task 4에서 route와 빌드를 검증한다.

**Interfaces:**
- Consumes: `/preview/home`, `/preview/profile`
- Produces: `GET /preview`

- [ ] **Step 1: 수동 프리뷰 목록을 한 파일에 선언한다**

```tsx
import Link from "next/link";
import { ChevronRightIcon } from "@/shared/ui/Icons";

const PREVIEWS = [
  {
    href: "/preview/home",
    title: "홈",
    description: "가입 여부, 피드, 이미지 fallback, 로딩·오류·위치 상태",
  },
  {
    href: "/preview/profile",
    title: "프로필",
    description: "그룹, 좋아요, 티켓의 기본·빈 상태",
  },
] as const;

export default function PreviewIndexPage() {
  return (
    <main className="min-h-full overflow-y-auto bg-surface-secondary px-ds-20 py-ds-24">
      <div className="mx-auto flex w-full max-w-(--layout-frame-max) flex-col gap-ds-20">
        <header className="flex flex-col gap-ds-4">
          <h1 className="text-heading-lg text-content-primary">UI 프리뷰</h1>
          <p className="text-body-md-regular text-content-secondary">
            화면을 선택한 뒤 프레임 바깥 메뉴에서 상태를 전환하세요.
          </p>
        </header>

        <ul className="flex flex-col gap-ds-12">
          {PREVIEWS.map((preview) => (
            <li key={preview.href}>
              <Link
                href={preview.href}
                className="flex items-center gap-ds-12 rounded-ds-md bg-surface-primary p-ds-16 active:bg-surface-tertiary"
              >
                <span className="flex min-w-0 flex-1 flex-col gap-ds-4">
                  <span className="text-body-lg-bold text-content-primary">{preview.title}</span>
                  <span className="text-body-md-regular text-content-secondary">
                    {preview.description}
                  </span>
                </span>
                <ChevronRightIcon className="shrink-0 text-icon-primary" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
```

인덱스는 server component로 유지한다. 상태, effect, API 호출이 없으므로 `"use client"`를 붙이지 않는다.

- [ ] **Step 2: 정적 검사를 실행한다**

Run:

```bash
pnpm check src/app/preview/page.tsx
pnpm typecheck
```

Expected: 두 명령 모두 exit code 0.

- [ ] **Step 3: 인덱스를 커밋한다**

```bash
git add src/app/preview/page.tsx
git commit -m "feat: UI 프리뷰 인덱스 추가"
```

### Task 4: 전체 검증과 수동 UI 확인

**Files:**
- Verify only

**Interfaces:**
- Consumes: `/preview`, `/preview/home`, `/preview/profile`
- Produces: 빌드 가능한 프리뷰 진입점과 확인 기록

- [ ] **Step 1: 저장소 정식 검증을 실행한다**

Run:

```bash
pnpm verify
```

Expected: `pnpm check`, `pnpm typecheck`, `pnpm build`가 모두 exit code 0. 자동 테스트가 없으므로 테스트 통과라고 표현하지 않는다.

- [ ] **Step 2: 개발 서버를 실행한다**

```bash
pnpm dev
```

Expected: Next.js가 사용 가능한 포트를 출력하고 `Ready` 상태가 된다.

- [ ] **Step 3: 세 경로의 HTTP 응답을 확인한다**

개발 서버가 3000번에서 실행됐다는 가정에서:

```bash
curl -I http://localhost:3000/preview
curl -I http://localhost:3000/preview/home
curl -I http://localhost:3000/preview/profile
```

Expected: 세 응답 모두 `HTTP/1.1 200 OK`. 다른 포트가 선택됐다면 출력된 포트만 바꾼다.

- [ ] **Step 4: 브라우저에서 상태 전환을 확인한다**

`/preview`에서 홈과 프로필 링크가 열리는지 확인한다. `/preview/profile`에서 다음 여섯 버튼이 각 본문을 바꾸는지 확인한다.

```text
그룹
그룹 · 빈 상태
좋아요
좋아요 · 빈 상태
티켓
티켓 · 빈 상태
```

브라우저 Network 패널에서 `/preview/profile` 진입과 상태 전환 중 profile API 요청이 0건인지 확인한다.

- [ ] **Step 5: 검증 중 수정이 있었다면 최종 커밋한다**

```bash
git add docs/profile-flow-design.md src/app/preview/page.tsx src/app/preview/profile/page.tsx
git commit -m "fix: 프리뷰 인덱스 검증 사항 반영"
```

수정이 없으면 빈 커밋을 만들지 않는다.

## Deliberate Non-Goals

- `/preview`가 `src/app/preview/**/page.tsx`를 자동 탐색하지 않는다. 제목·설명·표시 순서는 파일명만으로 결정할 수 없어 수동 배열이 더 작고 명확하다.
- 프리뷰 전용 fixture factory, context, 전역 store, query parameter 동기화를 만들지 않는다.
- 리뷰 작성 플로우는 이미 `/reviews/new`라는 실제 route가 있으므로 이 변경에서 별도 프리뷰를 만들지 않는다.
- loading/error는 API 연결 뒤 Screen이 소유할 상태다. 현재 props 기반 프로필 표시 컴포넌트 프리뷰에는 기본·빈 상태만 둔다.

## Self-Review

- Spec coverage: 기존 프리뷰 금지 문구를 새 요구에 맞게 갱신하고, PR #58의 상태 전환 패턴·API 미호출 조건·전체 인덱스 진입점을 각각 Task 1~3에 연결했다.
- Placeholder scan: 구현을 미루거나 다른 단계에 떠넘기는 표현이 없다.
- Type consistency: `ProfilePreviewState`, `ProfileGroupItem`, `ProfileFavoriteItem`, `ProfileTicketHistoryItem`은 현재 저장소의 실제 타입명과 일치한다.
- Verification: 저장소 정식 `pnpm verify`, 세 route의 200 응답, Network 패널의 API 요청 0건을 완료 기준으로 명시했다.
