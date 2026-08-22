# 리뷰 이어서 작성하기 — 라우트 분리 이행 계획

현재 `/reviews/new/**` 단일 트리를, 공용 코드(`reviews/_*`)와 두 진입 트리(`new`,
`drafts/[draftId]`)로 나누기 위한 계획이다. 초안을 쿼리스트링(`?saveId=`)이 아니라
경로로 식별하기로 한 결정의 이행 문서다.

## 왜 경로인가

초안은 서버 리소스다. `saveId`는 "보는 방식"이 아니라 **무엇을 불러오고 어디에 쓸지**를
결정하는 정체성이므로 경로에 둔다.

쿼리 방식의 결정적 약점은 실패가 조용하다는 것이다. 단계 이동 링크 한 곳에서 `saveId`를
빠뜨리면 에러 없이 빈 폼이 뜨고, 그대로 저장하면 원본 초안이 방치되거나 초안이 하나 더 생긴다.
경로 파라미터는 그 상태 자체가 만들어지지 않는다.

부수 효과로 새로고침 문제도 풀린다. 지금은 초안이 메모리에만 있어 새로고침하면
`useReviewDraftGuard`가 1단계로 되돌리는데, `drafts` 트리는 서버에서 다시 읽는다.

## 확인된 API 계약

`_scripts/api/openapi.json` 기준. 클라이언트는 `src/api/gen/save/save.gen.ts`에 이미 생성돼 있다.

| 메서드 | 경로 | operationId |
|---|---|---|
| POST | `/v1/saves` | `createSave` |
| GET | `/v1/saves` | `listSaves` |
| GET | `/v1/saves/{saveId}` | `getSave` |
| PUT | `/v1/saves/{saveId}` | `updateSave` |

```
SaveRequest         { placeId, photoAssetIds[], companionTagIds[], positivePointTagIds[], rating, content }
SaveDetailResponse  { saveId, reviewId, place, photos[], tags[], rating, content, aiSummary, createdAt }
PhotoConstraint     { maxCount, maxBytes, allowedContentTypes }
```

### 사진은 별도 업로드가 선행된다

`SaveRequest`가 받는 것은 파일이 아니라 `photoAssetIds`다.

```
POST /v1/media/upload-intents
  요청  { contentType, contentLength }
  응답  { assetId, uploadUrl, expiresAt }
```

presigned URL 방식이다 — intent 발급 → `uploadUrl`에 파일 업로드 → 얻은 `assetId`를
`SaveRequest.photoAssetIds`에 넣는다.

**현재 구현에는 업로드가 전혀 없다.** 사진은 `File`과 object URL로만 들고 있다
(`_stores/ReviewDraftProvider.tsx`). 즉 이어쓰기는 업로드 구현에 의존한다.

## 선결 합의 (코드 착수 전)

1. **architecture rule 갱신** — `reviews/_components`처럼 부모 라우트의 private segment를
   자식 라우트들이 공유하는 배치는 rule에 서술이 없다. rule은 `app/(group)/_*/`만 언급하고
   "다른 라우트의 private segment import 금지"라고만 적혀 있다. `docs/review-write-flow.md`
   미결 6번이 이미 같은 질문을 올려두었으므로 함께 해소한다.

2. **임시저장 정책 문서 수정** — `docs/review-write-flow.md`가 "초안은 임시 저장하지 않는다"고
   단언하고, 이탈 모달 문구도 "모두 삭제돼요"다. 이어쓰기를 넣으면 둘 다 코드와 어긋난다.

3. **저장 시점** — `createSave` / `updateSave`를 언제 부르는가. 단계 이동마다인지, 이탈 시점인지,
   명시적 저장 버튼인지에 따라 Provider 설계와 이탈 모달 문구가 갈린다. **이게 정해지지 않으면
   Phase 3 이후를 설계할 수 없다.**

4. **`[step]` 동적 세그먼트 채택 여부** — 트리가 둘이 되면 정적 세그먼트는 page 파일이 8개가 된다.
   `[step]` + `generateStaticParams`로 묶으면 정적 프리렌더를 유지하면서 없는 step은 404가 된다.
   라우트 분리와 독립적인 선택이라 따로 정한다.

## 이행 단계

각 Phase는 독립 커밋이고, 매 Phase 끝에 `pnpm verify`를 통과해야 한다.

### Phase 0 — 경로 헬퍼에 base 주입 (동작 변화 없음)

`_constants/steps.ts`의 `reviewStepPath(segment)`가 base를 받도록 바꾼다. 트리는 아직 하나이므로
동작은 그대로다. 참조 지점은 8곳이다.

```
_components/ReviewFlowShell.tsx   ← base를 prop으로 받는다 (핵심)
_hooks/useReviewDraftGuard.ts     ← base를 인자로 받는다
new/page.tsx, new/{store,photos,tags,rating,complete}/page.tsx
```

**이 Phase의 성공 기준은 `ReviewFlowShell`이 자기가 어느 트리에 있는지 모르는 것이다.**
`isDraft` 같은 플래그가 들어가기 시작하면 라우트를 나눈 이득이 사라진다. base 하나만 받아야 한다.

### Phase 1 — 공용 코드 승격 (순수 이동)

`git mv`로 `reviews/new/_*` → `reviews/_*`. import 경로 외 로직 변경을 금지하고 **이동만 하는
커밋으로 분리**한다. 그래야 diff에서 무엇이 이동이고 무엇이 변경인지 구분된다.

이동 대상: `_components`(8개 + `sheets`, `assets`), `_stores`(1), `_constants`(5),
`_hooks`(2), `_model`(4), `_utils`(3).

### Phase 2 — `new` 트리 재구성 — 해당 없음

합의 4에서 **단계를 정적 세그먼트로 유지**하기로 정해 `new` 트리는 그대로 두었다.
덕분에 `new`의 모든 단계가 정적 프리렌더(`○`)를 유지한다.

### Phase 3 — `drafts/[draftId]` 트리 추가 — 완료 (사진 제외)

- 단계 본문을 `_components/steps/`로 옮겨 두 트리가 같은 코드를 쓴다. `page.tsx`는 재export만 한다.
- `DraftReviewFlow`가 `useGetSave`로 초안을 읽어 `ReviewFlowShell`에 `initialDraft`로 넘긴다.
- **응답 전에는 단계를 그리지 않는다.** 초안 가드가 "매장이 없으면 1단계로" 판정하므로, 로딩 중에
  단계를 먼저 그리면 아직 도착하지 않은 매장을 없는 것으로 보고 되돌려 버린다.
- `initialDraft`는 마운트 시 한 번만 읽는다. 재조회가 일어나도 편집 중인 입력을 덮지 않는다.
- 사진은 담지 않는다. Phase 4에서 업로드와 함께 정한다.

검증 결과: `save_13`(매장·태그 2개·별점 5)이 각 단계에 그대로 복원되고, 없는 초안은 에러 문구로
끝나며 가드가 리다이렉트하지 않는다. `new` 트리는 빈 상태 그대로다.

### Phase 4 — 사진 업로드와 저장 연동

`createUploadIntent` → 업로드 → `assetId` 수집 → `createSave`/`updateSave`.
이탈 모달 문구도 이 시점에 바꾼다.

### Phase 5 — 진입점

`listSaves`로 초안 목록을 만들고 항목에서 `/reviews/drafts/{saveId}/{step}`으로 보낸다.

## 설계 리스크

1. **`ReviewPhoto` 모델 이원화 — 가장 큰 리스크.** 서버 초안의 사진은 URL(`Photo.url`)이고
   방금 고른 사진은 `File` + object URL이다. 한 모델이 두 출처를 표현해야 하는데,
   **object URL 해제 로직이 서버 URL에 적용되면 안 된다.** 현재 `ReviewDraftProvider`는 모든
   `previewUrl`을 `revokeObjectURL` 대상으로 본다. 출처를 타입으로 구분하지 않으면 여기서 깨진다.

2. **`ReviewFlowShell`의 트리 무지** — 위에 적은 대로 우아함의 유지 조건이다. 리뷰 시 확인한다.

3. **업로드 실패와 부분 성공** — 3장 중 2장만 업로드된 상태에서 저장하면 무엇을 남길지.

4. **`photoAssetIds` 순서** — `Photo`에 `order`가 있으므로 배열 순서가 표시 순서와 일치해야 한다.

## 검증

- 각 Phase마다 `pnpm verify`.
- Phase 1은 **동작 변화가 없어야** 하므로, 이동 전후로 리뷰 작성 플로우를 끝까지 한 번씩 돌려
  같은 결과가 나오는지 확인한다.
- Phase 3부터는 새로고침·딥링크·뒤로가기를 각 단계에서 확인한다. 이게 라우트 분리의 주된 이득이다.
