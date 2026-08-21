# 리뷰 작성 플로우 — 구현 읽기 가이드

> 대상 브랜치: `feat/#110-review-write-flow`
> 짝 문서: [`review-write-flow.md`](./review-write-flow.md) — 시안에서 **무엇을 만들기로 했는지**(요구사항 정본)
> 이 문서: 그 결정이 **코드에서 어떻게 동작하는지**와 **왜 그 형태인지**

지금 구현된 범위는 **1~4단계와 완료 화면 전부**다. 데이터를 가져오거나 제출하는 코드는 없다(§6).

---

## 1. 파일 지도

```
src/app/reviews/new/
├── layout.tsx                      ReviewFlowShell에 위임만 한다 (6줄)
├── page.tsx                        /reviews/new/store로 redirect
├── _constants/steps.ts             단계 정의 — 이 플로우의 단일 정본
├── _constants/
│   ├── steps.ts                    단계 정의 — 이 플로우의 단일 정본
│   └── tags.ts                     3단계 태그 그룹 2벌
├── _model/
│   ├── store.ts                    ReviewStore · CompleteReviewStore · 검색 결과 타입
│   ├── search.ts                   SearchStatus
│   ├── photo.ts                    ReviewPhoto · 최대 장수
│   └── tag.ts                      ReviewTag · ReviewTagGroup
├── _utils/reviewStore.ts           "다음" 게이트 판정 (순수 함수)
├── _hooks/useReviewDraftGuard.ts   초안 없이 열린 단계를 1단계로 되돌림
├── _stores/ReviewDraftProvider.tsx 초안 상태 Context (매장·사진·태그·별점·텍스트)
├── _components/
│   ├── ReviewFlowShell.tsx         GNB + Progress + Provider + 이탈 모달
│   ├── ExitConfirmModal.tsx        닫기 확인 모달
│   ├── StepHeader.tsx              단계 타이틀 + 필수 뱃지/안내 문구
│   ├── PhotoPicker.tsx             사진 첨부·삭제 (2단계)
│   ├── TagGroupField.tsx           태그 한 묶음 (3단계)
│   ├── StarRatingField.tsx         별점 입력 (4단계)
│   ├── ReviewCompleteVisual.tsx    완료 화면 비주얼
│   ├── assets/                     완료 화면 브랜드 에셋 (마스코트 PNG · 매장 일러스트 SVG)
│   └── sheets/
│       ├── StoreSearchSheet.tsx    매장 검색 바텀시트
│       ├── AddressSearchSheet.tsx  주소 검색 바텀시트
│       └── SearchOptions.tsx       두 시트가 공유하는 결과 행 3종 + 상태 표현
├── store/page.tsx                  1단계 화면
├── photos/page.tsx                 2단계 화면
├── tags/page.tsx                   3단계 화면
├── rating/page.tsx                 4단계 화면
└── complete/page.tsx               완료 화면
```

`.claude/rules/architecture.md`의 private segment 분류를 그대로 따랐다. `_model`은 타입만,
`_utils`는 순수 함수만, `_stores`는 라우트 범위 상태만 갖는다.

---

## 2. 단계 정의 — 모든 것이 여기서 파생된다

`_constants/steps.ts`

```ts
export const REVIEW_FLOW_BASE_PATH = "/reviews/new";

export const REVIEW_STEPS = [
  { segment: "store",  name: "방문 매장" },
  { segment: "photos", name: "사진 등록" },
  { segment: "tags",   name: "태그 선택" },
  { segment: "rating", name: "별점과 리뷰" },
] as const;

export const REVIEW_STEP_COUNT = REVIEW_STEPS.length;
```

이 배열 하나에서 세 가지가 파생된다.

| 파생물 | 사용처 |
|---|---|
| 진입 redirect 대상 (`REVIEW_STEPS[0].segment`) | `page.tsx` |
| Progress의 `max` (`REVIEW_STEP_COUNT`) | `ReviewFlowShell` |
| 현재까지 완료한 단계 수 (pathname 매칭) | `ReviewFlowShell`의 `findStepIndex` |

**단계를 추가·변경할 때 고칠 곳이 이 배열 한 군데다.** `as const`라 `ReviewStepSegment` 타입도
여기서 나온다.

---

## 3. 라우팅 — 왜 단계가 URL에 있는가

단일 라우트에 로컬 state로 단계를 숨기는 방식을 쓰지 않았다. 결정적 이유는 하나다.

**모바일에서 뒤로가기는 "이전 단계"여야 한다.** 시안에 뒤로가기 버튼이 명시돼 있고
"이전에 작성했던 내용 보존"까지 요구된다. 단일 라우트라면 안드로이드 하드웨어 백과
iOS 스와이프 백이 **플로우 전체를 이탈**시킨다. 모바일 전용 웹앱에서 이건 치명적이다.

부수적으로 단계별 딥링크·이탈 지점 추적이 가능해지고, 단계마다 `page.tsx`가 갈려
코드 분할과 변경 경계가 자연스러워진다.

`[step]` 동적 세그먼트가 아니라 명시적 세그먼트인 이유는, 동적 세그먼트면 URL로 임의 문자열이
들어오므로 경계에서 런타임 검증이 필요하기 때문이다(`conventions.md` — user input은 경계에서 검증).
명시적 세그먼트에는 그 부담이 없다.

---

## 4. 상태 소유권 — 이 구현의 핵심 기술 근거

```
app/reviews/new/layout.tsx          ← 단계 이동에서 리마운트되지 않는다
  └ ReviewFlowShell                 ← "use client"
      └ ReviewDraftProvider         ← useState(store)  ★ 초안이 여기 산다
          ├ GNB / Progress / ExitConfirmModal
          └ {children}              ← store/page.tsx  (단계 이동 시 여기만 교체)
```

App Router의 layout은 **자식 라우트 간 이동에서 리마운트되지 않는다.** 초안 상태를 layout 쪽에
두면 `/store → /photos → 뒤로 → /store` 이동에도 `useState`가 살아남는다.
즉 **"뒤로가기 시 내용 보존" 요구를 zustand도 localStorage도 없이 만족시킨다.**

localStorage를 쓰지 않은 건 취향이 아니라 시안 제약이다. 이탈 모달 본문이
`지금까지 입력한 내용이 모두 삭제돼요`라고 단언하므로, 복원 장치를 넣으면 문구와 모순된다.

`useReviewDraft()`는 Provider 밖에서 호출되면 던진다(`ReviewDraftProvider`).
Context 기본값을 `null`로 두고 훅에서 좁히는 형태라, 소비자는 항상 non-null 값을 받는다.

---

## 5. 1단계 데이터 흐름

### 5.1 두 경로가 타입 하나로 합류한다

매장을 정하는 길이 둘이다.

```
                       ┌─ 결과 선택 ────→ { id: "s1", name: "…", address: "…" }   (완성)
검색어 입력 → 결과 조회 ┤
                       └─ 직접 입력 ────→ { id: null,  name: "…", address: null } (미완성)
                                                    ↓ 주소 필드 노출 → 주소 시트
                                          { id: null,  name: "…", address: "…" }   (완성)
```

`_model/store.ts`

```ts
export type ReviewStore = {
  id: string | null;   // 서버 식별자 — 있으면 검색 경로, 없으면 직접 입력 경로
  name: string;
  address: string | null;
};
```

흔한 구현은 `inputMode: "search" | "manual"` 같은 모드 플래그를 두는 것이다. 그러면 모드와
데이터가 어긋날 수 있는 상태 공간이 생긴다. 여기서는 **`id`의 null 여부가 이미 경로를 말하므로**
플래그가 필요 없다. UI 분기가 한 줄로 끝난다.

```tsx
// store/page.tsx
const needsAddressInput = store !== null && store.id === null;
```

### 5.2 "다음" 게이트

`_utils/reviewStore.ts`

```ts
export function isReviewStoreComplete(store: ReviewStore | null): store is CompleteReviewStore {
  return store !== null && store.name.trim().length > 0 && store.address !== null;
}
```

판정 대상이 **검색어 문자열이 아니라 확정된 매장 객체**다. 검색어가 남아 있어도 매장을 고르지
않았으면 다음 단계로 넘길 데이터가 없기 때문이다. 검색어 기준이었다면 두 경로에 조건을 각각
써야 했겠지만, 완성된 객체 기준이라 **두 경로가 조건 한 벌을 공유**한다.

이 파일이 사실상 이 단계의 **정책이 사는 곳**이다. 게이트 규칙이 늘면 여기 모은다.

통과 결과는 `CompleteReviewStore`(= `ReviewStore & { address: string }`)로 좁혀진다.
다음 단계와 제출 코드가 이 타입을 요구하면 **"게이트를 통과한 매장만 흘러간다"를 타입이 강제**한다.
이름의 공백 여부까지는 타입으로 표현하지 않으므로 그 판정은 이 함수에만 남는다.

호출부는 한 곳이다 — `<Button disabled={!isReviewStoreComplete(store)}>`.

### 5.3 이벤트 → 상태 전이

| 사용자 행동 | 핸들러 | 결과 상태 |
|---|---|---|
| 매장 검색 결과 선택 | `handleSelectResult` | `{ id, name, address }` — 완성 |
| `'{검색어}' 직접 입력하기` | `handleDirectInput` | `{ id: null, name, address: null }` |
| 주소 검색 결과 선택 | `handleSelectAddress` | 기존 store에 `address`만 병합 |
| 검색 필드의 지우기(X) | `onValueChange` | `null` — 게이트 닫힘 |

마지막 항목이 한 번 꼬여 보이는 자리다. 검색 필드는 `readOnly`라 타이핑이 불가능하므로,
`onValueChange`가 불리는 경로는 **`SearchField`의 지우기 버튼뿐**이다
(`SearchField`의 `handleClear`가 `onValueChange("")`를 호출).
그래서 인자를 무시하고 무조건 `setStore(null)`로 처리한다.

필드 자체를 `readOnly`로 둔 이유는 값의 정본이 시트에서 고른 매장 객체이지 입력 문자열이
아니기 때문이다. 필드를 누르면 타이핑 대신 시트가 열린다(`onClick`).

---

## 6. 생성 mock API 연결

매장·주소 검색은 orval이 생성한 `useSearchPlaces`·`useSearchAddresses`를 사용한다. 응답의 선택 필드는
`_utils/reviewApiMappers.ts`에서 UI 모델로 좁혀, 불완전한 항목이 시트에 표시되지 않게 한다.

태그는 `useReviewFormConfig`의 `companionTags`·`positivePointTags`를 쓴다. 시안의 질문 제목·힌트는
클라이언트가 소유하고, tag id·label만 서버 응답으로 그린다.

mock backend가 필수로 받는 주소 검색 `userId`는 `NEXT_PUBLIC_MOCK_USER_ID`를 쓰며, 없거나 잘못되면
`1`로 안전하게 되돌린다. 별도의 MSW나 정적 fixture는 두지 않는다.

---

## 6.5 2단계 — 사진 등록

### 게이트가 없는 단계

시안 주석이 `매장 등록 이외에 다른 모든 페이지는 선택사항이기 때문에 기본으로 활성화 상태 설정`
이라고 못박는다. 그래서 "다음"에 조건을 걸지 않는다. 1단계의 `isReviewStoreComplete` 같은
판정이 여기엔 없는 것이 맞다.

대신 타이틀 아래가 "필수" 뱃지에서 안내 문구로 바뀐다. 둘은 같은 자리를 번갈아 쓰는 한 벌이라
`StepHeader`가 `required`로 함께 결정한다. 각 단계가 뱃지와 문구를 따로 조립하면 3·4단계에서
같은 분기가 반복된다.

### 첨부 버튼은 목록의 마지막 칸이다

시안에서 추가 버튼은 사진이 없을 때만 가로 전체를 쓰고, 한 장이라도 붙으면 썸네일과 같은
120 정사각이 되어 목록 끝에 이어 붙는다. 즉 목록과 별개의 버튼이 아니다. `PhotoPicker`는
이 둘을 한 줄 안에서 함께 배치하고, 0장일 때만 전체 폭 버튼으로 갈라진다.

높이(120)는 두 경우가 같고 폭만 다르므로, 120은 `cellHeight`·`cellWidth` 상수에 한 번만 둔다.

2장부터는 시안 폭(376)이 화면(320)을 넘는다. 줄바꿈하지 않고 **가로 스크롤**로 이어 붙인다
(시안 Image Container 폭이 376인 것이 근거). 스크롤 영역은 `-mx-ds-20 px-ds-20`으로 좌우
여백까지 덮어, 스크롤해도 콘텐츠가 화면 가장자리에서 잘리지 않는다.

3장을 채우면 첨부 버튼이 사라진다. **시안에 3장 상태가 없어 내린 판단이다**(짝 문서 미결 3번).

### 미리보기 URL의 소유자

첨부한 파일은 `URL.createObjectURL`로 미리보기를 만든다. 이 URL은 해제하지 않으면 남으므로
누가 해제할지가 분명해야 한다. `ReviewDraftProvider`가 목록과 URL을 **함께** 소유한다 —
목록에서 빠질 때 해제하고, 플로우를 벗어날 때 남은 것을 모두 해제한다. 목록의 소유자와 URL의
소유자가 갈리면 어느 쪽이 해제할 차례인지 알 수 없어진다.

### 초안 가드

2단계 이후는 `useReviewDraftGuard`로 **매장이 없으면 1단계로 되돌린다**(§9.1). `router.replace`를
쓰는 이유는 `push`면 되돌아간 뒤 뒤로가기가 다시 이 단계로 와서 무한 왕복이 되기 때문이다.

1단계 게이트를 통과한 초안만 다음 단계로 갈 수 있다. 검색 결과가 연결됐으므로 개발 전용 우회는 없다.

---

## 6.6 3단계 — 태그, 4단계 — 별점·텍스트

두 단계 모두 게이트가 없다(선택 단계). 2단계와 같은 이유다.

### 태그 그룹은 데이터다

그룹이 둘이고 구조가 같아 `TagGroupField` 하나로 렌더한다. 질문 제목·힌트는 시안이 정하고,
칩 id·label은 리뷰 폼 설정 endpoint가 제공한다.

라벨의 `(복수 가능)`은 시안에서 색이 다른 별도 조각이라 `hint`로 분리했다. 한 문자열로 합치면
색을 나눌 수 없다.

칩은 `shared/ui/Chip`의 **`size="lg"`가 시안과 그대로 맞는다**(px-12 · py-8 · body-md-medium ·
radius full). 선택 색도 `selected`가 맞고 `aria-pressed`도 이미 붙어 있어 Chip은 손대지 않았다.
그룹은 `fieldset`/`legend`로 감싸 어떤 질문에 속한 칩인지가 접근성 트리에 남는다.

> **시안과 다른 점**: 칩마다 20x20 컬러 일러스트 아이콘이 붙지만 이번 범위에서 뺐다.
> 조각이 흩어져 있고(가족 아이콘만 12조각) `download_assets`가 인스턴스 내부 노드를 지원하지
> 않아 통째로 받을 수 없다. 디자이너 익스포트를 받으면 `tags.ts`의 각 항목에 `icon`만 더하면
> 되도록 두었다. 짝 문서 미결 8번.

### 별점은 버튼 5개가 아니라 radio group이다

하나만 고르는 입력이라 그렇다. 버튼 5개로 두면 여러 개를 누를 수 있는 것처럼 읽히고 키보드
좌우 이동도 직접 만들어야 한다. 시각적으로 숨긴 native radio + 별 라벨로 두 문제가 함께 사라진다.

채움은 누른 별까지 전부다(시안 주석: `왼쪽에서 4번째 별 클릭시 왼쪽 3개도 자동 선택`) —
`score <= value`로 판정한다. 44x44는 시안 값이자 터치 타깃 기준이라 라벨 크기로 유지한다.

별 색은 채움 `icon-interactive-primary`(#F43D2D), 빈 별 `surface-tertiary`(#E5E5E5)다. 빈 별에
맞는 icon 계열 토큰이 없는데, 값과 역할이 Progress의 빈 트랙(`bg-surface-tertiary`)과 같아
같은 토큰을 쓴다. 새 토큰을 만들지 않은 이유다.

텍스트는 `Textarea`의 `showCount` + `maxLength`를 그대로 쓴다. 시안 입력 박스 180은 컨트롤
`min-h`로 맞췄다(180 − 상하 패딩 24 − 테두리 2 = 154).

---

## 6.7 완료 화면

### 플로우 안에 두되, 단계는 아니다

`reviews/new/complete`로 플로우 layout **안에** 둔다(짝 문서 미결 2번). 매장명과 사진을 보여주려면
초안이 살아 있어야 하는데, 초안은 이 layout의 provider가 소유하기 때문이다. 밖으로 빼면 값을
따로 넘겨야 하고, 사진은 object URL이라 layout이 언마운트되는 순간 해제된다.

대신 껍데기가 완료 화면을 알아본다. `REVIEW_STEPS`에 넣지 않으므로 진행률과 뒤로가기는 자동으로
빠지고(§8), 나머지 둘은 `REVIEW_COMPLETE_PATH` 비교로 갈린다.

| | 단계 화면 | 완료 화면 |
|---|---|---|
| GNB 제목 | 리뷰 쓰기 | **완료** |
| 진행률·뒤로가기 | 있음 | 없음 (단계가 아니라서 자동) |
| X 동작 | 이탈 확인 모달 | **바로 나감** — 작성이 끝나 "그만두시겠어요?"가 성립하지 않는다 |

4단계에서 완료로는 `router.replace`로 간다. `push`면 뒤로가기로 작성 화면에 되돌아온다.

### 비주얼 두 벌 모두 고정 브랜드 에셋이다

**사용자가 올린 사진을 여기에 보여주지 않는다.** 시안의 220 자리는 레이어 이름이
`KakaoTalk_Photo_…`라 사진처럼 보이지만 실제 내용은 고정 마스코트 이미지다(`1028:7062`).

| 시안 | 에셋 | 크기 |
|---|---|---|
| 완료_사진 | 마스코트 PNG (`review-complete-mascot.png`) | 220 |
| 완료_일러스트 | 매장 일러스트 SVG (`review-complete.svg`) | 240 |

무엇을 언제 쓰는지는 시안 주석에 없다. 지금은 사진 유무로 갈라 두었으나 **둘 다 고정 에셋이라
이 분기의 근거가 약하다** — 디자이너 확인이 필요하다(짝 문서 미결 5번).

두 에셋 모두 이 플로우에서만 쓰는 브랜드 그림이라 `_components/assets/`에 둔다. 여러 색을 가진
그림이라 단색 `currentColor` 계약을 쓰는 `shared/ui/icons`와는 성격이 다르다.

마스코트는 원본이 854x1024라 `next/image`로 최적화해 내보내고, 정사각 자리에서 잘리지 않도록
`object-contain`으로 맞춘다.

> Figma의 노드 단위 익스포트에는 캔버스 조상 프레임(`#1E1E1E` 배경 등)이 딸려 온다. 그래서
> 익스포트를 그대로 쓰지 않고, 아트워크 조각 두 개(상점·컨페티)를 Figma가 준 좌표대로 240 박스에
> 배치해 한 파일로 합쳤다. 좌표를 옮겼을 뿐 그림 자체는 익스포트한 것 그대로다.

### 남은 것

- 현재 OpenAPI에는 리뷰 제출 endpoint가 없다. 완료 화면은 초안을 보여주기만 하고 서버에 보내지 않는다.
- 완료 후 브라우저 뒤로가기를 하면 3단계로 갈 수 있다. 플로우 전체를 히스토리에서 걷어내려면
  제출 시점과 초안 폐기 시점을 함께 정해야 해서, API 도입 때 다룬다.
- `다른 리뷰 보러가기`가 가리키는 `/feed`는 아직 없다.

---

## 7. 컴포넌트 경계

### 7.1 결과 행은 도메인이 아니라 "시안이 그리는 줄"로 받는다

`SearchOptions.tsx`는 세 종류의 행을 갖는다.

| 컴포넌트 | 모양 | props |
|---|---|---|
| `SearchOptionRow` | 2줄 (매장명 + 주소) | `primary`, `secondary` |
| `AddressOptionRow` | 뱃지 2줄 (도로명/지번) | `roadAddress`, `jibunAddress` |
| `DirectInputOption` | 1줄 강조 | `query` |

`SearchOptionRow`가 `store`/`address`가 아니라 `primary`/`secondary`를 받는 게 의도적이다.
서버 필드 이름이 바뀌어도 호출부 매핑만 고치면 된다.

`rowStyles`를 세 행이 공유하고, 다른 부분만 각자 갖는다.

### 7.2 로딩·에러는 공통, 빈 상태는 시트가 판정한다

검색 결과 자리가 가질 수 있는 상태를 `_model/search.ts`가 정의한다.

```ts
export type SearchStatus = "idle" | "loading" | "error" | "ready";
```

**여기에 `empty`가 없는 것이 핵심이다.** 무엇을 비었다고 볼지가 시트마다 다르기 때문이다.

| 시트 | 고를 수 있는 행 | 결과 0건일 때 |
|---|---|---|
| 매장 검색 | 결과 + **직접 입력 옵션** | 직접 입력만 남는다 → **빈 상태가 아니다** |
| 주소 검색 | 결과뿐 | 고를 게 없다 → **빈 상태** |

`idle`도 마찬가지다. 매장 시트는 검색 전에 보여줄 것이 없지만, 주소 시트에는 시안이 정한
**검색 팁**(`이렇게 검색해 보세요` + 예시 3줄)이 있다. 주소는 도로명·지번·건물명으로 표기가
갈려 사용자가 무엇을 넣어야 할지 모르기 때문이다.

그래서 책임을 이렇게 나눴다.

- `SearchResultArea`(공통) — **언제** 무엇을 보여줄지를 정한다. `loading`·`error`는 직접 그리고,
  `idle`은 시트가 넘긴 슬롯을, `ready`는 children을 그린다.
- **무엇을 보여줄지는 각 시트가 정한다.** 매장 시트는 `idle` 슬롯도 빈 분기도 넘기지 않고,
  주소 시트만 `idle={<AddressSearchGuide />}`와 `results.length === 0` 분기를 갖는다.

네 표현(로딩·에러·빈)이 모두 `SearchOptionMessage`라는 한 형태를 공유하므로 시각적으로 일관되고,
"이 시트에 검색 전 안내나 빈 상태가 있는가"라는 도메인 판단은 시트에 남는다.

> 문구는 시안이 없어 임시로 정했다. `SearchOptions.tsx` 상단 상수와 `AddressSearchSheet`의
> `EMPTY_MESSAGE` 한 곳씩만 고치면 된다. 오류 재시도는 QueryProvider의 기본 retry 정책에 맡긴다.

`DirectInputOption`이 결과 목록의 일부라는 점도 여기서 나온다. 시안상 이 옵션은 **결과 유무와
무관하게 목록 끝에 항상 붙는다.** 결과 0건 화면은 이것만 남은 상태일 뿐 별도 화면이 아니다.

### 7.3 Badge를 shared로 올린 이유

"필수" 뱃지와 주소 결과의 "도로명/지번" 뱃지가 같은 형태다. **두 번째 사용처가 확인된 시점에**
`shared/ui/Badge.tsx`로 승격했다(architecture rule 2번: 두 곳 이상에서 쓰이면 승격 검토).

`Chip`과 색·모양이 닮았지만 기반을 공유하지 않는다. `Chip`은 `<button>`이라 그대로 쓰면
**누를 수 없는 라벨이 접근성 트리에 버튼으로 노출**된다. 상태 스케일도 다르다 — Badge에는
hover·active·disabled·focus가 아예 없다.

### 7.4 시트 높이는 내용이 정하지 않는다

두 시트 모두 `<BottomSheet height="fixed">`를 쓴다. 시안에서 이 플로우의 시트 세 개가
**내용량과 무관하게 모두 같은 높이**이기 때문이다.

| Figma 프레임 | 시트 내용 | 시트 높이 |
|---|---|---|
| 매장 검색_Active (`1357:62202`) | 결과 3행 + 직접 입력 | 720 |
| 매장 검색_결과 0건 (`1357:62184`) | 직접 입력 1행 | 720 |
| 주소 검색_Intro (`1357:62728`) | 검색 팁만 | 720 |

기능적 이유도 같은 방향이다. 검색 시트는 입력에 따라 결과 수가 계속 바뀌는데, 높이가 내용을
따라가면 타이핑할 때마다 시트가 출렁이고 상단 검색 필드의 위치가 흔들린다.

`BottomSheet`의 기본값은 `content`(내용만큼)다. 시안이 고정 높이인 이 두 시트만 `fixed`를 넘긴다.

높이 토큰은 두 개다. `--layout-sheet-height`(92dvh)가 **화면에 보이는 높이**이고,
팝업 박스에는 `--layout-sheet-box-height`(= 보이는 높이 + overscroll)를 건다. overscroll 연장분
64px이 화면 밖으로 밀려나기 때문인데, 이걸 더해 주지 않으면 **화면이 작을수록 보이는 비율이
줄어든다** — 고정 px를 백분율에서 깎는 꼴이라서다. 실측으로 확인한 값:

| 뷰포트 높이 | 더하기 전 | 더한 뒤 |
|---|---|---|
| 844 | 84.4% | 92.0% |
| 640 | 82.0% | 92.0% |

> ⚠️ **여기까지는 "92dvh가 맞다"는 전제 위의 이야기다.** 그 전제 자체가 검증되지 않았고,
> iOS 실기기 확인도 남아 있다. **작업을 완료 처리하기 전에 §9.4를 반드시 다시 읽는다.**

---

## 8. 껍데기(ReviewFlowShell)가 소유하는 것

모든 단계가 공유하는 네 가지를 한 컴포넌트가 갖는다.

| 요소 | 근거 |
|---|---|
| `GNB` (제목 + 닫기 X) | X가 모든 단계에 있다 |
| `Progress` | 단계마다 값만 다르다 |
| `ExitConfirmModal` | X가 모든 단계에 있으므로 모달도 공유 |
| `ReviewDraftProvider` | §4 |

**Progress 값 규칙이 직관과 다르다.** `value`는 "현재 단계"가 아니라 **"완료한 단계 수"**다.
2단계 화면의 실측값이 25%였다는 점이 이 규칙을 확정한다 — 현재 단계 인덱스라면 50%여야 한다.

```tsx
/** 현재 경로가 몇 번째 단계인지. 완료 화면처럼 단계가 아닌 경로면 null. */
function findStepIndex(pathname: string) {
  const index = REVIEW_STEPS.findIndex(
    (step) => pathname === `${REVIEW_FLOW_BASE_PATH}/${step.segment}`,
  );

  return index === -1 ? null : index;
}
```

함수는 **"몇 번째 단계인가"** 하나만 답한다. 이름과 반환값이 같은 것을 가리키고, "단계가 아님"은
`-1`이라는 sentinel 대신 `null`이라 타입이 좁혀준다.

"완료한 단계 수"라는 두 번째 의미는 호출부의 이름이 갖는다.

```tsx
// 앞선 단계가 곧 완료한 단계이므로 단계 인덱스가 그대로 완료 수가 된다.
const completedSteps = findStepIndex(pathname);
...
{completedSteps !== null && <Progress value={completedSteps} max={REVIEW_STEP_COUNT} … />}
```

X를 눌렀을 때의 이동은 `router.back()`이다. 시안 주석
`사용자가 경험하던 이전 화면으로 이동`을 그대로 옮긴 것이다.

---

## 9. 남은 과제와 보류 항목

### 9.1 새로고침하면 초안이 사라진다 — 가드는 넣었고, 저장 여부는 미결

layout에 상태를 두는 선택(§4)의 대가다. `/reviews/new/tags`를 새로고침하면 매장이 `null`인 채
3단계가 열린다. 지금은 1단계밖에 없어 드러나지 않지만, 2단계가 생기는 순간 실제 문제가 된다.

**"임시저장 금지"는 이탈 정책이지 새로고침 정책이 아니다.** 이탈 모달의
`지금까지 입력한 내용이 모두 삭제돼요`는 사용자가 **X를 눌러 나갈 때** 무엇이 일어나는지를
약속한다. 나가기에서 저장분을 명시적으로 지우기만 하면, 새로고침 복원은 이 문구와 모순되지 않는다.

특히 2단계가 사진 첨부라는 점이 중요하다. 모바일에서 카메라·갤러리를 다녀오면 브라우저가 탭을
폐기했다가 복원하는 일이 잦고, 그때마다 초안이 사라지면 실사용에서 데이터를 잃는다.

두 갈래이고, 어느 쪽을 택하든 **가드는 공통으로 필요**하다.

| | (A) 가드만 | (B) sessionStorage + 가드 |
|---|---|---|
| 새로고침 | 입력 유실 → 1단계로 | 복원 |
| 탭 폐기 후 복원 | 유실 | 복원 |
| 나가기 | 자동으로 사라짐 | 명시적으로 지워야 함 |
| 사진(File 객체) | — | **직렬화 불가라 복원 대상 아님** |

(B)의 걸림돌은 사진이다. 텍스트 초안만 복원되고 사진만 사라지는 부분 복원은 그 자체로 혼란스러울
수 있다. 제안: **저장 범위를 직렬화 가능한 초안으로 한정하고, 사진은 복원하지 않는 것을 명시**한다.
합의 필요 항목이다.

**가드는 2단계와 함께 들어갔다** — `_hooks/useReviewDraftGuard.ts`. 어느 쪽을 택하든 필요한
공통분모이므로 먼저 넣었다. 남은 결정은 **(A)와 (B) 중 무엇을 택할지**, 그리고 (B)라면
사진만 복원되지 않는 부분 복원을 받아들일지다.

### 9.2 해결됨

| 항목 | 처리 |
|---|---|
| 게이트 predicate가 아무것도 좁히지 못함 | `CompleteReviewStore`로 좁힌다 (§5.2) |
| `completedStepCount`의 이름·의미 불일치 | `findStepIndex` + `null`로 분리 (§8) |
| 주소 시트에 빈 상태 없음 | `SearchStatus` + `SearchResultArea` 도입, 로딩·에러도 함께 (§7.2) |
| 주소 필드에 키보드 경로 없음 | Enter·Space로 시트를 연다 (`store/page.tsx`의 `handleAddressFieldKeyDown`) |
| 불필요한 `onChange={() => undefined}` | 제거. `readOnly`가 있으면 React는 controlled 경고를 내지 않는다 |

### 9.3 보류

**시트 검색어가 페이지 state라 시트를 닫아도 남는다.** 다시 열면 이전 검색어가 보인다.
시안에 없는 동작이라 확정 전까지 그대로 둔다.

### 9.4 ⚠️ 작업 완료 전에 반드시 다시 볼 것 — 시트 높이

**아래 세 항목이 정리되기 전에는 시트 높이를 "시안대로"라고 말할 수 없다.**
지금 구현은 "주어진 값(92dvh) 안에서 계산이 정확하고 이름이 정직한" 상태이지 그 값이
검증된 상태가 아니다. PR을 올리거나 이 플로우를 완료 처리하기 전에 이 절을 다시 읽는다.

**① 92dvh라는 값의 근거 — 디자이너 확인 필요 (가장 큼)**

시안의 시트는 720, 프레임은 780이라 92%다. 그런데 그 780에는 **상태바(44)와 Safari 크롬(133)이
포함**돼 있다. 웹이 실제로 쓰는 뷰포트는 그 목업에서 603px이고, 그 안에서 시트가 차지하는
높이는 587px = **97%**다. 즉 같은 시안이 기준을 어디로 두느냐에 따라 92%도 되고 97%도 된다.

`92dvh`는 이 판단이 기록되지 않은 채 이전 작업에서 들어온 값이고, 이번 작업은 그 값을
그대로 이어받았다. **"시트 높이의 기준이 기기 화면인지 브라우저 뷰포트인지"를 디자이너에게
확인해야 한다.** 답에 따라 `--layout-sheet-height` 한 줄만 바꾸면 된다.

**② iOS Safari 실기기 확인 — 키보드와 `dvh`**

검증은 데스크톱 Chrome에서만 했다. iOS Safari에서 키보드가 올라올 때 `dvh`는 줄지 않으므로,
고정 높이 시트의 하단이 키보드에 가려질 수 있다. 검색 시트는 입력이 핵심이라 이 거동이
높이 결정 자체를 뒤집을 수 있다. **실기기에서 시트를 열고 키보드를 올려 확인한다.**

같은 이유로 "고정 높이면 검색 필드가 키보드 위에 남는다"는 주장은 근거로 쓰지 않았다.

**③ 위 방향 드래그 — 미검증**

아래로 스와이프해 닫는 동작은 실제 드래그로 확인했다(정상). 위로 끄는 방향은 합성 포인터
이벤트가 Base UI에 닿지 않아 결론을 내지 못했다. `--layout-sheet-overscroll`(64px)이 그 상황을
위한 여유인데, 실제로 얼마나 끌리는지 모르는 채로 64px이 충분하다고 가정하고 있다.
`translateY(-64px)`까지는 하단이 덮이고 `-100px`에서 36px 틈이 생기는 것만 확인했다.

**남은 구조적 부채**: `--layout-sheet-box-height`는 팝업이 정확히
`pb-(--layout-sheet-overscroll)`을 준다고 가정한다. 둘이 같이 움직여야 하는데 코드가 그것을
강제하지 못한다. 근본 해법은 overscroll 배경 연장을 박스 모델 밖으로 빼는 것인데, 팝업의
`overflow-hidden`(둥근 모서리 클리핑)과 충돌해 이번에는 손대지 않았다. ①②가 정해진 뒤에
다루는 것이 맞다 — 지금 고치면 값이 바뀌면서 다시 손대게 된다.

---

## 10. 짝 문서의 미결 사항 중, 코드가 이미 한쪽으로 정한 것

`review-write-flow.md`에는 "팀 합의 필요"로 남은 항목이 있는데 구현이 앞서간 것이 셋이다.
PR에서 명시적으로 물어야 한다.

| 미결 | 코드의 현재 선택 |
|---|---|
| 1. API 연결 | 생성 mock API를 사용하고 MSW는 사용하지 않음 |
| 6. 세그먼트 이름 | `store` / `photos` / `tags` / `rating`으로 확정해 사용 중 |
| 7. `store/page.tsx`가 `new/_components/`를 import해도 되는가 | `reviews/new/**`를 하나의 라우트로 보는 해석으로 구현 |
