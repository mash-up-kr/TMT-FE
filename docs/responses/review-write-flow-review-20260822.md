# 리뷰 작성 플로우 — 흐름도와 구조 리뷰

> 대상: `src/app/reviews/new/**` (브랜치 `feat/리뷰 작성 플로우`, 2026-08-22 워킹트리 기준)
> 검증: `pnpm check`, `pnpm typecheck` 통과. `pnpm build`는 코드 변경이 없어 생략.

---

## 1. 파일 지도

```text
src/app/reviews/new/
├── layout.tsx                         ReviewFlowShell 한 줄 위임
├── page.tsx                           /reviews/new → /reviews/new/store redirect
│
├── store/page.tsx                     1단계  방문 매장 (필수) — 매장/주소 검색 시트 조립
├── photos/page.tsx                    2단계  사진 등록 (선택)
├── tags/page.tsx                      3단계  태그 선택 (선택) — useReviewFormConfig
├── rating/page.tsx                    4단계  별점·리뷰 (선택) — replace → complete
├── complete/page.tsx                  완료   (단계 아님)
│
├── _components/
│   ├── ReviewFlowShell.tsx            GNB + Progress + ExitConfirmModal + ReviewDraftProvider
│   ├── ExitConfirmModal.tsx           "그만두시겠어요?" 모달
│   ├── StepHeader.tsx                 제목 + 필수 Badge / 선택 안내문
│   ├── PhotoPicker.tsx                썸네일 목록 + 첨부 버튼(목록 마지막 칸)
│   ├── TagGroupField.tsx              fieldset + Chip 토글 묶음
│   ├── StarRatingField.tsx            radio 기반 5점 별점
│   ├── ReviewCompleteVisual.tsx       완료 화면 일러스트/마스코트
│   └── sheets/
│       ├── StoreSearchSheet.tsx       매장 검색 BottomSheet (직접 입력 옵션 항상 존재)
│       ├── AddressSearchSheet.tsx     주소 검색 BottomSheet (idle=검색 가이드, 빈 상태 있음)
│       └── SearchOptions.tsx          SearchResultArea(상태 분기) + Row/List/Message 조각
│
├── _stores/ReviewDraftProvider.tsx    초안 상태(store/photos/tags/rating/text) + object URL 소유
├── _hooks/useReviewDraftGuard.ts      매장 없이 열린 단계 → 1단계로 replace
├── _utils/
│   ├── reviewStore.ts                 isReviewStoreComplete (type guard, "다음" 게이트)
│   └── reviewApiMappers.ts            API 응답 → UI 모델 (Place/Address/Tag)
├── _model/{store,photo,tag,search}.ts 라우트 한정 타입
└── _constants/steps.ts                REVIEW_STEPS / BASE_PATH / COMPLETE_PATH
```

---

## 2. 런타임 흐름도

### 2.1 라우트 트리와 상태 소유

```text
                      ┌──────────────────────────────────────────────────────────┐
                      │  layout.tsx  →  <ReviewFlowShell>                        │
                      │  ┌────────────────────────────────────────────────────┐  │
                      │  │ <ReviewDraftProvider>   ← 초안은 여기 한 곳에만     │  │
                      │  │   store | photos | selectedTagIds | rating | text   │  │
                      │  │                                                    │  │
                      │  │   GNB(title, ← back, ✕ close)                      │  │
                      │  │   Progress(value = 단계 index = 완료한 단계 수)       │  │
                      │  │   <main>{children}</main>   ← page.tsx 가 갈아끼워짐 │  │
                      │  │   <ExitConfirmModal/>                              │  │
                      │  └────────────────────────────────────────────────────┘  │
                      └──────────────────────────────────────────────────────────┘
                                               │
   /reviews/new ──redirect──▶ /store ──push──▶ /photos ──push──▶ /tags ──push──▶ /rating ──replace──▶ /complete
                              (0/4)            (1/4)            (2/4)            (3/4)               (Progress 없음)
                              필수             선택             선택             선택
                              guard X          guard ○          guard ○          guard ○             guard ○
```

- 단계 page가 바뀌어도 layout은 리마운트되지 않는다 → 뒤로가기해도 입력이 남는다.
- `Progress`는 "현재 단계"가 아니라 "완료한 단계 수"라 단계 index를 그대로 쓴다.
- rating → complete는 `replace`라 완료 후 뒤로가기로 작성 화면에 돌아오지 않는다.

### 2.2 1단계 — 매장 선택 (store/page.tsx)

```text
  SearchField(readOnly, 값 = store.name)
        │ click / Enter
        ▼
  ┌─ StoreSearchSheet ─────────────────────────────────┐
  │ SearchField(query) ──▶ useSearchPlaces(trim(query)) │
  │                         enabled: open && query>0    │
  │ status = idle | loading | error | ready             │
  │                                                     │
  │  SearchResultArea(status)                           │
  │    ├ idle    → null                                 │
  │    ├ loading → "검색 중이에요"                        │
  │    ├ error   → "검색에 실패했어요"                     │
  │    └ ready   → [SearchOptionRow × n]                 │
  │                [DirectInputOption '{q}' 직접 입력하기] ← 항상 있음 → 빈 상태 없음
  └─────────────────────────────────────────────────────┘
        │ 결과 선택                          │ 직접 입력
        ▼                                    ▼
  setStore({id, name, address})        setStore({id:null, name, address:null})
                                              │
                                              ▼  needsAddressInput = store.id === null
                                       TextField "주소"(readOnly)
                                              │ click / Enter / Space
                                              ▼
                                       ┌─ AddressSearchSheet ───────────────────────┐
                                       │ useSearchAddresses({userId: mock, query})   │
                                       │ SearchResultArea(status, idle=검색 가이드)    │
                                       │   ready & 0건 → "검색 결과가 없어요"          │
                                       │   ready & n건 → [AddressOptionRow 도로명/지번] │
                                       └─────────────────────────────────────────────┘
                                              │ 선택
                                              ▼
                                       setStore({...store, address: roadAddress})

  "다음" 버튼  disabled = !isReviewStoreComplete(store)
               isReviewStoreComplete: store !== null && name.trim() !== "" && address !== null
               → 통과하면 store는 CompleteReviewStore 로 좁혀진다
```

### 2.3 2~4단계와 가드

```text
  photos / tags / rating / complete 공통 진입
  ────────────────────────────────────────────
  const hasStore = useReviewDraftGuard();   // isReviewStoreComplete(store)
  if (!hasStore) return null;               //  └ false → router.replace("/reviews/new/store")

  photos ─┬─ PhotoPicker(photos, addPhotos, removePhoto)
          │    ├ 0장: 첨부 버튼이 가로 전체
          │    └ n장: [썸네일 × n][첨부 버튼(n/3)]  가로 스크롤, 3장이면 버튼 숨김
          └─ addPhotos: 남은 자리만큼 slice → {id: uuid, file, previewUrl: createObjectURL}
             removePhoto: revokeObjectURL 후 제거
             Provider unmount: 남은 previewUrl 전부 revoke

  tags   ─┬─ useReviewFormConfig()
          │    ├ isLoading → "불러오는 중"
          │    ├ isError   → "불러오지 못했어요"
          │    └ isSuccess → TagGroupField × 2
          │                   (companionTags / positivePointTags → mapReviewTags)
          └─ toggleTag(id): Set add/delete — 상한·최소 없음

  rating ─┬─ StarRatingField(value=rating)  radio 5개, 0 = 미선택
          ├─ Textarea(reviewText, maxLength 500, showCount)
          └─ "다음" → router.replace(COMPLETE)

  complete ── ReviewCompleteVisual(photos)  photos.length === 0 ? 일러스트(240) : 마스코트(220)
              버튼: "홈으로 가기" replace("/")  /  "다른 리뷰 보러가기" replace("/feed")
```

### 2.4 GNB 닫기(✕)와 이탈 모달

```text
  ✕ click ─▶ isComplete ? router.back()
                        : setExitOpen(true)
                              │
                              ▼
                   ExitConfirmModal
                     ├ "계속 작성하기" → 닫기
                     └ "나가기"       → router.back()   ⚠ 아래 결함 참고

  ← back 버튼: completedSteps > 0 일 때만 렌더 → router.back()
```

---

## 3. 구조 리뷰

### 총평

구조는 architecture rule을 거의 교과서적으로 따른다 — `_model`은 타입만, `_utils`는 순수 함수, 응답→UI 변환은 `reviewApiMappers`, 초안 상태는 layout 레벨 Provider. 접근성 처리(fieldset/legend, sr-only, aria-label, focus 링)도 꼼꼼하다.

잘한 설계:

- `SearchStatus` + `SearchResultArea`로 로딩/에러/idle 분기를 한 곳에 모았다.
- `isReviewStoreComplete`를 type guard로 만들어 `CompleteReviewStore`로 좁혔다.
- object URL 생성·해제 소유권을 Provider 한 곳에 묶었다.

다만 "우아한가"를 기준으로 보면 **끝까지 밀어붙이지 못한 지점**이 몇 개 있고, 동작 결함 하나가 있다.

### 🔴 동작 결함 (우선)

**이탈 모달 "나가기"가 플로우를 안 벗어남** — `ReviewFlowShell.tsx:80-83`

`onExit`이 `router.back()`인데, 2단계 이후에서 누르면 히스토리상 이전은 *같은 플로우의 앞 단계*다. layout이 리마운트되지 않으니 초안도 그대로 남아 "지금까지 입력한 내용이 모두 삭제돼요"가 거짓이 된다. 같은 이유로 완료 화면의 ✕(`router.back()`)는 rating이 `replace`로 밀려났으므로 **tags 단계로 돌아간다**. `docs/review-write-flow-implementation.md` §9.1 표의 "나가기 → 자동으로 사라짐"은 1단계에서만 참이다.

→ 플로우 진입 전 경로로 나가거나(`replace("/")` 등) 초안 reset을 명시적으로 해야 한다.

### 🟠 구조·가독성 (우아함 갭)

| # | 항목 | 위치 | 제안 |
|---|------|------|------|
| 1 | **단계 경로가 한 곳이 아님** — `steps.ts`는 "고칠 곳이 이 배열 한 군데"라 선언했지만 다음 단계 이동은 문자열로 흩어져 있음. `ReviewStepSegment` 타입과 `REVIEW_STEPS[].name`은 **미사용** | `store/page.tsx:142`, `photos/page.tsx:39`, `tags/page.tsx:71` | `getStepPath(segment: ReviewStepSegment)` 헬퍼를 두고 페이지가 그걸 쓴다 |
| 2 | **`store/page.tsx`가 너무 많이 앎** — 170줄, useState 4개, sheet open / query / trim / react-query / mapper / status 계산이 매장·주소 두 벌 대칭 반복 | `store/page.tsx` 전체 | `_hooks/useStoreSearch`, `useAddressSearch`로 분리. `getSearchStatus`도 hook 옆으로 |
| 3 | **인덱스 결합** — `TAG_GROUPS[0]`↔`companionTags`, `[1]`↔`positivePointTags`를 순서로 묶어 `id: "companion"`이 놀고 있음. 응답→`ReviewTagGroup[]` 변환을 페이지가 수행(rule상 `_utils/` 몫) | `tags/page.tsx:26-29` | `mapReviewTagGroups(config)`를 mapper로, 그룹 라벨은 `_constants/`로 |
| 4 | **가드가 narrow된 값을 버림** — `boolean` 반환이라 `store?.name`이 남음 | `useReviewDraftGuard.ts:34`, `complete/page.tsx:31` | `CompleteReviewStore \| null` 반환 → `const store = useReviewDraftGuard(); if (!store) return null;` |
| 5 | **mock userId 이중 파싱** — 페이지는 number, `mutator.ts`는 string으로 따로 해석(폴백 규칙도 다름) | `store/page.tsx:21-23` | `_constants/` 또는 `shared/constants/`로 내리고 폴백을 맞춘다 |
| 6 | **상수 위치 세 갈래** — `MAX_REVIEW_PHOTO_COUNT`는 `_model/`, `MAX_RATING`은 컴포넌트, `MAX_REVIEW_TEXT_LENGTH`는 page. `ReviewFormConfigResponse`가 `photo.maxCount / rating.max / content.maxLength`를 이미 내려줌 | `_model/photo.ts`, `StarRatingField.tsx:7`, `rating/page.tsx:13` | 우선 `_constants/`로 모으고, 다음 정리에서 formConfig 값으로 대체 검토 |

### 🟡 컨벤션

- **주석 정책이 반쯤 진행 중** — 워킹트리 diff가 `PhotoPicker`, `StarRatingField` 등의 주석을 걷어냈지만 `ReviewCompleteVisual.tsx:10-18`("확인이 필요하다(짝 문서 미결 5번)"), `useReviewDraftGuard.ts:11-22`(docs §9.1 인용), `_model/search.ts`, `TagGroupField`의 JSDoc은 남아 있다. "왜"는 한 줄로 남기고 추적 메모·문서 참조는 docs/PR로 보내되, 파일마다 기준이 다르지 않게 한 번에 정리한다.
- `ExitConfirmModal.tsx:20,32-34`: TITLE을 sr-only `Dialog.Title`과 `aria-hidden` `<p>`로 두 번 렌더한다. Modal에 `titleVisible`이 있으나 스타일이 달라 우회한 것 — Modal API(제목 스타일 커스텀 불가)의 한계라 이 파일 탓은 아니지만 흔적이 남는다.
- `useReviewDraftGuard() → if (!hasStore) return null` 4회 반복은 명시적이라 괜찮다. `(guarded)/layout.tsx`로 모을 수도 있지만 현재 형태가 읽기엔 더 직관적이라 유지 추천.

### 정리

- [ ] 즉시: 🔴 나가기/완료 ✕의 `router.back()` 수정
- [ ] 우아함 완성: 경로 헬퍼(1), 검색 hook 분리(2), 태그 mapper 이동(3), 가드 반환값 narrow(4)
- [ ] 컨벤션 정돈: mock userId(5), 상수 위치(6), 주석 정책
