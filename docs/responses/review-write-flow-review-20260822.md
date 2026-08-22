# 리뷰 작성 플로우 — 흐름도와 구조 리뷰

> 대상: `src/app/reviews/new/**` (브랜치 `feat/#110-review-write-flow`, 2026-08-22 기준)
> 검증: `pnpm verify`(biome → tsc → next build) 통과.
>
> **갱신** — 아래 3장의 지적은 전부 반영됐다. 각 항목에 반영 커밋을 달아 두었고,
> 1·2장의 흐름도는 반영 후 코드 기준이다.

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
│       ├── SearchSheet.tsx            두 검색 시트의 공통 껍데기 (틀·닫기·입력·상태 분기)
│       ├── StoreSearchSheet.tsx       매장 검색 목록 (직접 입력 옵션 항상 존재)
│       ├── AddressSearchSheet.tsx     주소 검색 목록 (idle=검색 가이드, 빈 상태 있음)
│       └── SearchOptions.tsx          SearchResultArea(상태 분기) + Row/List/Message 조각
│
├── _stores/ReviewDraftProvider.tsx    초안 상태(store/photos/tags/rating/text) + object URL 소유
├── _hooks/
│   ├── useReviewDraftGuard.ts         매장 없이 열린 단계 → 1단계로 replace, 확정 매장 반환
│   └── useSearchSheetState.ts         검색 시트 한 벌의 열림·입력·요청 활성 조건
├── _utils/
│   ├── reviewStore.ts                 isReviewStoreComplete (type guard, "다음" 게이트)
│   ├── searchStatus.ts                쿼리 결과 → SearchStatus
│   └── reviewApiMappers.ts            API 응답 → UI 모델 (Place/Address/Tag/TagGroup)
├── _model/{store,photo,tag,search}.ts 라우트 한정 타입
└── _constants/
    ├── steps.ts                       단계 세그먼트 + reviewStepPath() + COMPLETE/EXIT 경로
    ├── review.ts                      사진·별점·글자 수 상한
    ├── tagGroups.ts                   태그 그룹 메타 (라벨 + 응답 필드 source)
    └── mockUser.ts                    mock 사용자 식별자
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
  │ storeSheet = useSearchSheetState()                  │
  │   .input(원문) .query(trim) .open .enabled           │
  │ useSearchPlaces({query}, {enabled})                 │
  │ status = toSearchStatus(query, storeSearch)         │
  │        = idle | loading | error | ready             │
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
  setStore({id, name, address,         setStore({id:null, name, address:null,
            selectedAddress:null})                 selectedAddress:null})
                                              │
                                              ▼  needsAddressInput = store.id === null
                                       TextField "주소"(readOnly)
                                              │ click / Enter / Space
                                              ▼
                                       ┌─ AddressSearchSheet ───────────────────────┐
                                       │ addressSheet = useSearchSheetState()        │
                                       │ useSearchAddresses({userId: MOCK_USER_ID})  │
                                       │ SearchSheet(status, idle=검색 가이드)         │
                                       │   ready & 0건 → "검색 결과가 없어요"          │
                                       │   ready & n건 → [AddressOptionRow 도로명/지번] │
                                       └─────────────────────────────────────────────┘
                                              │ 선택
                                              ▼
                                       setStore({...store, address: roadAddress,
                                                 selectedAddress: result})
                                       └ addressId·좌표를 들고 있어야 서버가 위치를 확정한다

  "다음" 버튼  disabled = !isReviewStoreComplete(store)
               isReviewStoreComplete: store !== null && name.trim() !== "" && address !== null
               → 통과하면 store는 CompleteReviewStore 로 좁혀진다
```

### 2.3 2~4단계와 가드

```text
  photos / tags / rating / complete 공통 진입
  ────────────────────────────────────────────
  const store = useReviewDraftGuard();      // CompleteReviewStore | null
  if (store === null) return null;          //  └ null → router.replace(reviewStepPath("store"))
                                            // 매장을 안 쓰는 단계는 `useReviewDraftGuard() !== null`

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
          │                   mapReviewTagGroups(config)
          │                   └ REVIEW_TAG_GROUPS의 source로 응답 필드를 찾는다(인덱스 결합 아님)
          └─ toggleTag(id): Set add/delete — 상한·최소 없음

  rating ─┬─ StarRatingField(value=rating)  radio 5개, 0 = 미선택
          ├─ Textarea(reviewText, maxLength 500, showCount)
          └─ "다음" → router.replace(COMPLETE)

  complete ── ReviewCompleteVisual(photos)  photos.length === 0 ? 일러스트(240) : 마스코트(220)
              버튼: "홈으로 가기" replace(EXIT_PATH)  /  "다른 리뷰 보러가기" replace("/feed")
```

### 2.4 GNB 닫기(✕)와 이탈 모달

```text
  ✕ click ─▶ isComplete ? exitFlow()
                        : setExitOpen(true)
                              │
                              ▼
                   ExitConfirmModal
                     ├ "계속 작성하기" → 닫기
                     └ "나가기"       → exitFlow()

  exitFlow() = router.replace(REVIEW_FLOW_EXIT_PATH)
               └ 플로우 밖으로 나간다. layout이 언마운트되며 초안과 object URL이 함께 정리된다.

  ← back 버튼: completedSteps > 0 일 때만 렌더 → router.back()
               └ 이건 실제로 앞 단계로 가는 것이 맞으므로 back() 그대로다.
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

### 🔴 동작 결함 — 반영 완료 (`3ded7a9`)

**이탈 모달 "나가기"가 플로우를 안 벗어남** — `ReviewFlowShell.tsx:80-83`

`onExit`이 `router.back()`인데, 2단계 이후에서 누르면 히스토리상 이전은 *같은 플로우의 앞 단계*다. layout이 리마운트되지 않으니 초안도 그대로 남아 "지금까지 입력한 내용이 모두 삭제돼요"가 거짓이 된다. 같은 이유로 완료 화면의 ✕(`router.back()`)는 rating이 `replace`로 밀려났으므로 **tags 단계로 돌아간다**. `docs/review-write-flow-implementation.md` §9.1 표의 "나가기 → 자동으로 사라짐"은 1단계에서만 참이다.

**반영** — `REVIEW_FLOW_EXIT_PATH`(`"/"`)로 `replace`한다. 플로우를 벗어나면 layout이 언마운트되면서 초안과 object URL이 함께 정리되므로 초안 reset 함수는 두지 않았다. 히스토리를 단계 수만큼 되감는 방법도 검토했으나 "모든 단계는 push, 4단계→완료만 replace"라는 불변식에 기대고, 이 레포에는 그 불변식을 지켜줄 자동 테스트가 없어 단계가 늘면 조용히 어긋난다. GNB 좌측 뒤로가기는 실제로 앞 단계로 가는 것이 맞아 `router.back()`을 유지했다.

### 🟠 구조·가독성 — 반영 완료

| # | 항목 | 반영 | 커밋 |
|---|------|------|------|
| 1 | **단계 경로가 한 곳이 아님** — `steps.ts`는 "고칠 곳이 이 배열 한 군데"라 선언했지만 다음 단계 이동은 문자열로 흩어져 있음. `ReviewStepSegment` 타입과 `REVIEW_STEPS[].name`은 **미사용** | `reviewStepPath(segment)`를 유일한 통로로 두고 redirect·가드·진행률·세 단계의 "다음"이 모두 이걸 쓴다. `REVIEW_STEPS`는 세그먼트 문자열 배열이 되고 미사용 `name`은 삭제. 오타가 타입 에러다. | `3af0367` |
| 2 | **`store/page.tsx`가 너무 많이 앎** — 170줄, useState 4개, sheet open / query / trim / react-query / mapper / status 계산이 매장·주소 두 벌 대칭 반복 | `useSearchSheetState` + `toSearchStatus`로 검색 한 벌이 5줄 → 3줄. 170줄 → 145줄. orval hook은 params 타입이 달라 감싸지 않고 페이지에 남겼다. | `a81b6d0` |
| 3 | **인덱스 결합** — `TAG_GROUPS[0]`↔`companionTags`, `[1]`↔`positivePointTags`를 순서로 묶어 `id: "companion"`이 놀고 있음. 응답→`ReviewTagGroup[]` 변환을 페이지가 수행(rule상 `_utils/` 몫) | `REVIEW_TAG_GROUPS`의 `source` 필드가 응답 필드를 가리킨다. 태그가 아닌 필드를 적으면 타입 에러(`photo`로 확인). 변환은 `mapReviewTagGroups`로 이동. | `fcdee03` |
| 4 | **가드가 narrow된 값을 버림** — `boolean` 반환이라 `store?.name`이 남음 | `CompleteReviewStore \| null` 반환. 완료 화면의 옵셔널 체이닝 제거. effect 의존성은 객체가 아니라 boolean. | `983a5e9` |
| 5 | **mock userId 이중 파싱** — 페이지는 number, `mutator.ts`는 string으로 따로 해석(폴백 규칙도 다름) | 양쪽을 같은 검증(양수 정수, 아니면 기본값)으로 맞췄다. import 경계상 상수를 공유할 수 없어 각자 읽되 서로를 가리키는 주석을 남겼다. env 파싱은 `_constants/mockUser.ts`로. | `b6b572c` |
| 6 | **상수 위치 세 갈래** — `MAX_REVIEW_PHOTO_COUNT`는 `_model/`, `MAX_RATING`은 컴포넌트, `MAX_REVIEW_TEXT_LENGTH`는 page. `ReviewFormConfigResponse`가 `photo.maxCount / rating.max / content.maxLength`를 이미 내려줌 | `_constants/review.ts`로 셋을 모았다. `_model/photo.ts`에는 타입만 남는다. formConfig 연동은 보류 — 필드가 전부 optional이라 폴백이 어차피 필요하고, 모든 단계가 응답을 기다리면 로딩이 플로우 전체로 번진다. | `3af0367` |

### 🟡 컨벤션

- **주석 정책** (`44b6cda`에서 정리) — `PhotoPicker`, `StarRatingField` 등의 시안 근거 주석을 걷어냈지만 `ReviewCompleteVisual.tsx:10-18`("확인이 필요하다(짝 문서 미결 5번)"), `useReviewDraftGuard.ts:11-22`(docs §9.1 인용), `_model/search.ts`, `TagGroupField`의 JSDoc은 남아 있다. "왜"는 한 줄로 남기고 추적 메모·문서 참조는 docs/PR로 보내되, 파일마다 기준이 다르지 않게 한 번에 정리한다.
- `ExitConfirmModal.tsx:20,32-34`: TITLE을 sr-only `Dialog.Title`과 `aria-hidden` `<p>`로 두 번 렌더한다. Modal에 `titleVisible`이 있으나 스타일이 달라 우회한 것 — Modal API(제목 스타일 커스텀 불가)의 한계라 이 파일 탓은 아니지만 흔적이 남는다.
- `useReviewDraftGuard() → if (!hasStore) return null` 4회 반복은 명시적이라 괜찮다. `(guarded)/layout.tsx`로 모을 수도 있지만 현재 형태가 읽기엔 더 직관적이라 유지 추천.

### 정리

- [x] 🔴 나가기/완료 ✕의 `router.back()` 수정 — `3ded7a9`
- [x] 경로 헬퍼(1), 상수 위치(6) — `3af0367`
- [x] 검색 상태 hook + 시트 껍데기 분리(2) — `a81b6d0`
- [x] 태그 mapper 이동(3) — `fcdee03`
- [x] 가드 반환값 narrow(4) — `983a5e9`
- [x] mock userId 파싱 일치(5) — `b6b572c`
- [x] 주석 정책 — `44b6cda`

### 남은 것 (이번 범위 밖)

- `sessionStorage` 초안 복원 — `docs/review-write-flow-implementation.md` §9.1 미결
- `formConfig`의 제약값 연동
- `/feed` 라우트 부재 (완료 화면 버튼이 없는 경로를 가리킨다)
- 완료 화면 비주얼 분기 기준 — 디자이너 확인 대기
- 리뷰 제출 API 연동 — endpoint 미제공
