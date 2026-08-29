# 리뷰 이어쓰기 프론트엔드 핸드오프

## 문서 목적

리뷰 작성 플로우에 서버 저장과 이어쓰기를 연결할 때 필요한 현재 상태, 권장 구조, 제외 범위와 완료
조건을 정리한다. 구현 정본은 OpenAPI 생성 코드와 실제 `src/` 구조이며, 이 문서는
2026-08-29 스냅샷을 설명한다.

## 결론

- 저장 정책은 **단계 전환 체크포인트 + 명시적 이탈 직전 저장**으로 한다.
- `saveId`는 전역 상태가 아니라 URL(`/reviews/drafts/{saveId}`)을 정본으로 삼는다.
- 기존 `ReviewDraftProvider`는 입력 상태만 소유하고, route-private `useReviewSave`가 저장·이동을
  조율한다.
- 신규 작성과 사진 없는 초안 이어쓰기에서 사진 선택·업로드를 지원한다.
- 선택한 사진은 최종 완료 시 presigned URL로 업로드하고 `photoAssetIds`에 담는다. 완료 전
  체크포인트와 이탈 저장에는 새 사진을 처음 붙이지 않는다.
- 기존 사진이 있는 초안을 전체 교체 PUT하면 사진이 유실될 수 있으므로 사진 초안은 이어쓰기 저장
  대상에서 제외한다.

## 현재 구현 상태

### 이미 있는 기반

- 리뷰 작성 라우트: `/reviews/new/{step}`
- 이어쓰기 라우트: `/reviews/drafts/{saveId}/{step}`
- 작성 상태: `src/app/reviews/_stores/ReviewDraftProvider.tsx`
- 초안 상세 조회와 초기화: `DraftReviewFlow` + `mapSaveDetailToDraft`
- 공통 요청에서 `X-User-Id`와 POST/PUT `Idempotency-Key` 자동 첨부: `src/api/mutator.ts`

### 구현 결과

- 마이페이지 진입 시 `GET /v1/saves`로 이어쓰기 안내 시트 노출
- 초안이 하나면 해당 초안으로 바로 이동
- 초안이 여러 개면 `/reviews/continue`에서 선택
- 목록 응답을 화면 모델 `ContinuableDraft`로 변환
- `EmptyNotice`에 이어쓰기 마스코트 variant 추가
- Store → Photos → Tags → Rating 체크포인트에 `createSave`/`updateSave` 연결
- 이탈 직전 저장 및 저장 실패 시 입력·화면 유지
- 완료 응답의 `reviewId` 확인과 관련 query cache 무효화
- PUT 직전 최신 상세를 재조회해 사진이 생긴 초안의 저장 차단
- 최종 제출에서 upload intent 발급 → 스토리지 PUT → `photoAssetIds` 전체 교체 연결

## 사용 API

| 용도 | API | 프론트 처리 |
|---|---|---|
| 미완성 초안 목록 | `GET /v1/saves` | 안내 시트와 선택 화면 |
| 초안 상세 | `GET /v1/saves/{saveId}` | 작성 상태 초기화 |
| 업로드 준비 | `POST /v1/media/upload-intents` | asset ID와 presigned URL 발급 |
| 사진 업로드 | presigned `uploadUrl`에 `PUT` | 파일 원문 업로드 |
| 신규 초안/리뷰 저장 | `POST /v1/saves` | 첫 체크포인트 |
| 기존 초안 저장/완료 | `PUT /v1/saves/{saveId}` | 전체 snapshot 교체 |
| 초안 폐기 | `DELETE /v1/saves/{saveId}` | 새로 쓰기 또는 명시적 폐기 정책 |

`POST`와 `PUT`은 같은 `SaveRequest`를 사용하지만 의미가 다르다.

- POST: `placeId`와 `newPlace` 중 정확히 하나를 보낸다.
- PUT: 기존 `placeId`를 그대로 보내고 `newPlace`는 보내지 않는다. 서버가 매장 불변성과 같은
  완성도 판정을 다시 수행한다.
- PUT은 전체 교체이므로 일부 필드만 보내는 patch처럼 사용하지 않는다.
- 최종 PUT 응답의 `reviewId`가 존재할 때만 완료 화면으로 이동한다.

## 권장 구조

```text
ReviewDraftProvider
└─ 입력 상태
   ├─ store
   ├─ photos(File, previewUrl, assetId)
   ├─ selectedTagIds
   ├─ rating
   └─ reviewText

useReviewSave
└─ 저장 coordinator
   ├─ 전체 snapshot → SaveRequest 변환
   ├─ saveId 유무에 따라 POST/PUT 선택
   ├─ query cache 갱신
   └─ 성공 후 route 이동

reviewApiMappers
├─ SaveDetailResponse → ReviewDraftSnapshot
├─ SaveListItemResponse[] → ContinuableDraft[]
└─ ReviewDraftSnapshot → SaveRequest
```

별도 전역 store, persistence provider, 상태 머신은 추가하지 않는다. 현재 플로우는 URL과 기존 Provider,
route-private hook으로 충분하다.

## 저장 데이터 흐름

### 신규 작성

1. `/reviews/new/store`에서 매장을 선택한다.
2. `다음`을 누르면 현재 전체 snapshot으로 `POST /v1/saves`를 호출한다.
3. 성공 응답의 `saveId`를 사용해 `/reviews/drafts/{saveId}/photos`로 `replace`한다.
4. 이후 각 단계의 `다음`은 `PUT /v1/saves/{saveId}` 후 다음 단계로 이동한다.
5. 마지막 단계의 PUT 응답에 `reviewId`가 있으면 완료 화면으로 이동한다.
6. 요청 실패 시 현재 화면과 Provider 상태를 유지한다.

매장 선택 전에는 서버가 요구하는 유효한 저장 대상을 만들 수 없으므로 초안을 생성하지 않는다.

### 이어쓰기

1. `GET /v1/saves/{saveId}`와 리뷰 폼 설정을 조회한다.
2. 상세 응답을 `ReviewDraftSnapshot`으로 변환해 Provider를 한 번 초기화한다.
3. 재조회가 실패해도 이미 편집 중인 Provider를 다시 만들거나 덮어쓰지 않는다.
4. 각 체크포인트에서 최신 상세의 사진 여부를 확인한 뒤 전체 snapshot을 PUT한다.
5. 완료되면 초안 목록 cache에서 해당 Save가 빠지도록 무효화한다.

### 명시적 이탈

- 유효한 매장이 없으면 저장하지 않고 종료한다.
- 유효한 매장이 있으면 현재 snapshot을 POST 또는 PUT한 뒤 종료한다.
- 로컬 `File`은 복원할 수 없으므로 선택한 사진은 이탈 저장에서 제외하고 모달에 이를 안내한다.
- 저장 실패 시 자동으로 닫지 않는다. 입력을 유지하고 재시도 또는 저장하지 않고 나가기를 사용자가
  선택하게 한다.
- `beforeunload`에서 네트워크 저장을 보장하려 하지 않는다. 마지막 완료 체크포인트까지만 복원하는
  것을 정상 동작으로 본다.

## Coordinator 계약

Step 컴포넌트는 생성 API의 호출 순서를 알지 않는다.

```ts
type ReviewSaveActions = {
  saveAndGo: (nextStep: ReviewStepSegment) => Promise<void>;
  complete: () => Promise<void>;
  saveAndExit: () => Promise<void>;
  isPending: boolean;
};
```

- `saveAndGo`: 저장 성공 후에만 이동한다.
- `complete`: `reviewId`를 확인하고 완료 화면으로 이동한다.
- `saveAndExit`: 현재 snapshot 저장 후 플로우 밖으로 이동한다.
- mutation pending 동안 CTA와 닫기 중복 요청을 막는다.

hook을 각 Step에서 호출하더라도 `saveId`는 URL/flow context에서 읽고, 실제 변환과 저장 함수는
한 곳을 사용한다. 요청 상태를 여러 화면에서 동시에 공유해야 하는 요구가 생기기 전에는 새 Context를
추가하지 않는다.

## 사진 업로드와 제외 범위

`photos` 단계에서 필수 1장, 최대 3장의 JPG·PNG·WEBP 파일을 선택한다. 실제 API 계약 테스트에서
태그·평점·본문이 모두 있어도 사진이 0장이면 `reviewId`가 생성되지 않았다. 최종 완료 시 각 파일에 대해 upload
intent를 발급하고 presigned URL에 원문을 PUT한 다음, 선택 순서대로 `photoAssetIds`를 Save 요청에
담는다. 업로드에 성공한 asset ID는 Provider에 기록해 Save 실패 후 재시도에서 재업로드하지 않는다.

서버 상세의 `Photo.photoId`는 PUT이 요구하는 asset ID가 아니다. 따라서 서버에 이미 사진이 붙은
초안을 전체 교체하면 기존 사진을 안전하게 보존할 수 없어 이어쓰기 대상으로 열지 않는다.

- 목록의 `thumbnailUrl`이 존재하는 초안은 선택 불가 상태와 안내 문구를 제공한다.
- 직접 `/reviews/drafts/{saveId}`로 진입한 경우 상세 응답의 `photos.length > 0`이면 편집 화면 대신
  지원하지 않는 초안 안내와 안전한 이탈 경로를 제공한다.
- 사진 초안에 `PUT` 또는 `DELETE`를 자동 호출하지 않는다.
- 사진 선택은 신규 작성과 사진 없는 초안의 현재 세션에서만 지원한다.
- 새 사진은 최종 완료에서 처음 붙인다. 미완성 응답으로 이미 붙은 사진은 이후 전체 교체 PUT에서도
  같은 asset ID를 보존한다.

사진이 붙은 초안까지 이어쓰려면 상세 응답에서 PUT에 재전송할 공식 `assetId`를 먼저 제공해야 한다.
현재 프론트는 PUT 직전 상세를 다시 조회하지만 GET과 PUT은 원자적이지 않다. 다른 클라이언트의 동시
수정을 절대적으로 막으려면 백엔드가 version/ETag 기반 조건부 갱신을 제공해야 한다.

## 태그 변환

화면 상태는 선택된 태그 ID를 하나의 Set으로 관리하지만 Save 요청은 아래 두 배열로 나뉜다.

- `companionTagIds`
- `positivePointTagIds`

`ReviewFormConfigResponse`의 각 태그 목록을 기준으로 선택 ID를 분류한다. 상세 응답의 `tags`는 그룹
정보가 없으므로 이어쓰기 초기화와 PUT 전에 form config가 필요하다. 태그 ID가 그룹 사이에서 전역으로
유일하다는 전제에 의존하며, 그렇지 않다면 백엔드 응답에 그룹 정보가 추가돼야 한다.

## 오류 처리

- Save 요청 실패: 이동하지 않고 서버 `title`을 toast로 보여준다.
- `SAVE_ALREADY_REVIEWED`: 초안 상세 cache를 제거하고 목록 또는 완료된 리뷰로 안내한다.
- `SAVE_NOT_FOUND`: 삭제되거나 만료된 초안으로 안내한 뒤 초안 목록을 다시 조회한다.
- 최종 PUT의 `reviewId`가 없음: 완료 화면으로 보내지 않고 미완성 필드를 다시 확인하게 한다.
- 상세 로딩 실패: 현재 `DraftReviewFlow`의 오류 상태를 유지하되 재시도 동작을 추가한다.

## Query cache 정책

- POST로 초안 생성 성공: `listSaves` 무효화
- PUT으로 미완성 초안 저장 성공: 현재 Provider를 유지하고 `listSaves`를 무효화
- PUT으로 리뷰 완료 성공: `listSaves`, 내 리뷰 목록, 홈/피드 관련 query 무효화
- DELETE 성공: `getSave(saveId)` 제거, `listSaves` 무효화

정확한 query key는 Orval 생성 함수(`getListSavesQueryKey`, `getGetSaveQueryKey` 등)를 재사용한다.
문자열 key를 화면에 복제하지 않는다.

## 최소 변경 파일

새 파일은 저장 orchestration 한 곳만 추가하는 방향을 우선한다.

```text
src/app/reviews/
├─ _hooks/
│  └─ useReviewSave.ts                 # 추가
├─ _model/
│  └─ draft.ts                         # snapshot/목록 모델 보완
├─ _utils/
│  ├─ reviewApiMappers.ts              # Save 요청/응답 순수 변환 추가
│  └─ uploadReviewPhoto.ts             # intent 발급과 presigned PUT
├─ _constants/
│  └─ steps.ts                         # Store → Photos → Tags → Rating
└─ _components/
   ├─ ReviewFlowShell.tsx              # 이탈 저장
   ├─ ReviewStepScreen.tsx             # photos 화면 매핑
   └─ steps/
      ├─ StoreStep.tsx                 # saveAndGo("photos")
      ├─ PhotosStep.tsx                # saveAndGo("tags")
      ├─ TagsStep.tsx                  # saveAndGo("rating")
      └─ RatingStep.tsx                # complete()
```

다음은 추가하지 않는다.

- 전역 review store
- 수동 API client 또는 fetch wrapper
- 별도 persistence Context
- autosave debounce와 요청 queue
- 신규 업로드 라이브러리 또는 별도 업로드 상태 머신

## 미확정 정책

### 새로 작성하기와 기존 초안 삭제

DELETE 설명에는 새로 작성할 때 이전 임시저장을 버린다고 되어 있지만, 목록 API와 현재 선택 화면은
여러 초안을 지원한다. 새 리뷰 진입 시 다음 중 어느 초안을 폐기할지 제품 정책이 필요하다.

- 가장 최근 초안 하나
- 모든 미완성 초안
- 사용자에게 선택하도록 안내
- 기존 초안을 유지하고 새 초안을 추가

정책 확정 전에는 새 리뷰 진입만으로 DELETE를 호출하지 않는다.

## 구현 순서

1. 사진 단계와 파일 검증 복구
2. presigned URL 업로더와 asset ID 재사용 구현
3. 최종 Save 요청에 `photoAssetIds` 연결
4. 사진 초안의 목록 선택과 직접 진입 차단 유지
5. Store → Photos → Tags → Rating 체크포인트 연결
6. 이탈 저장과 오류 UI 연결
7. query cache 갱신과 통합 검증

## 인수 조건

### 신규 작성

- [x] 매장 선택 후 첫 `다음`에서 Save가 생성되고 URL에 `saveId`가 반영된다.
- [x] 각 단계 저장 성공 후에만 다음 단계로 이동한다.
- [x] Store → Photos → Tags → Rating 순서로 진행한다.
- [x] 사진이 0장이면 Photos 단계와 최종 완료 경계에서 진행을 막는다.
- [x] 최종 제출 시 선택한 사진을 업로드하고 asset ID 순서를 Save 요청에 보존한다.
- [x] 요청 실패 후 입력값이 유지된다.
- [x] 최종 응답에 `reviewId`가 있을 때만 완료 화면이 열린다.

### 이어쓰기

- [x] 미완성 초안 목록에서 하나를 선택해 진입할 수 있다.
- [x] 사진 없는 초안의 매장, 태그, 평점, 본문이 서버 값으로 복원된다.
- [x] 사진이 있는 초안은 PUT 없이 안전하게 진입이 차단된다.
- [x] 이어쓰기 완료 후 관련 초안·내 리뷰 query를 갱신한다.
- [x] 삭제되거나 이미 완료된 초안에 진입했을 때 복구 경로가 제공된다.

### 검증

- [x] mapper의 신규/이어쓰기/태그 분류 로직에 최소 runnable check를 남긴다.
- [x] `pnpm check`와 `pnpm typecheck`를 통과한다.
- [x] 라우트 코드 변경을 포함한 `pnpm verify`를 통과한다.
- [ ] 로컬에서 사진 포함 신규 작성, 이어쓰기, Save 실패와 재시도를 수동 확인한다.
- [ ] 사진 초안의 목록 선택과 직접 URL 진입이 안전하게 차단되는지 확인한다.

## 핸드오프 체크

구현 시작 전에 아래 두 가지만 명시적으로 닫는다.

1. 사진 초안을 목록에서 숨길지 비활성 상태로 보여줄지
2. 새 리뷰 시작 시 여러 기존 초안을 어떻게 처리할지
