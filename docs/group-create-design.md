# 그룹 생성 설계

## 목적

`/groups/new`에서 Figma `1313:22397`을 기준으로 4단계 그룹 생성 화면을 제공한다.
화면 모델과 Orval 생성 타입을 분리해 API 필드 변경의 영향이 mapper와 Container 밖으로 퍼지지 않게 한다.

## 화면 구조

```text
page.tsx
└─ GroupCreateContainer
   ├─ 그룹 태그 조회
   ├─ 그룹 생성 mutation
   ├─ API 모델 변환
   └─ 생성 성공 후 /groups/[groupId] 이동
      └─ GroupCreateScreen
         ├─ 1. 이름 · 한 줄 소개
         ├─ 2. 카테고리 · 지역
         ├─ 3. 대표 이미지
         └─ 4. 상세 소개
```

- `GroupCreateContainer`: API, query invalidation, 생성 완료 라우팅을 담당한다.
- `GroupCreateScreen`: 현재 단계, 작성 중인 값, BottomSheet 열림 상태를 담당한다.
- `GroupCreateFlow`처럼 범위와 상태 소유권이 드러나지 않는 이름은 사용하지 않는다.
- 단계는 `basicInfo → tags → image → description` 순서의 이름으로 식별한다.

## 단계 상태 관리

- 현재의 고정된 4단계 선형 플로우에는 `use-funnel`을 도입하지 않는다.
- 단계 이름과 순서 상수로 숫자 연산과 타입 단언 없이 다음·이전 단계를 계산한다.
- draft와 이미지 Object URL의 수명주기는 `useGroupCreateDraft`가 계속 소유한다.
- 분기·중첩 단계나 브라우저 히스토리 기반 복원이 제품 요구사항이 되면 `use-funnel` 도입을 다시 검토한다.

## 파일 구성

```text
src/app/groups/new/
├─ page.tsx
├─ _components/
│  ├─ GroupCreateContainer.tsx
│  └─ GroupCreateScreen.tsx
├─ _constants/
│  └─ groupCreate.ts
├─ _hooks/
│  └─ useGroupCreateDraft.ts
├─ _model/
│  └─ groupCreate.ts
└─ _utils/
   └─ groupCreateMapper.ts
```

단계별 JSX는 우선 `GroupCreateScreen`에 둔다. 별도 파일로 분리하면서 다수의 draft와 callback props를 전달하게 된다면 분리하지 않는다. 독립적인 변경 이유와 작은 props 계약이 확인되는 경우에만 분리한다.

## 재사용 대상

- 레이아웃: `ScreenLayout`, `GNB`, `Progress`
- 입력: `TextField`, `Textarea`
- 선택 UI: `Chip`, `BottomSheet`, `Button`, `ButtonStack`
- 태그 옵션 변환: `groups/_utils/groupMappers.ts`의 `toGroupTagOptions`
- 선택 행 UI: 그룹 도메인의 `FilterOption`을 생성 요구사항과 일치하는 범위에서 재사용한다.

`Select`, `GroupFilters`, 리뷰 작성 플로우 컴포넌트는 책임과 데이터 흐름이 달라 직접 재사용하지 않는다.

## 화면 모델

```ts
type GroupCreateDraft = {
  groupName: string;
  summaryDescription: string;
  foodCategoryId: string;
  regionIds: string[];
  groupImageId?: string;
  detailedDescription?: string;
};
```

화면은 그룹 도메인 용어를 사용한다. API 계약의 이름은 mapper에서만 다룬다.

```text
groupName           → name
summaryDescription  → oneLineDescription
regionIds           → regionTagIds
groupImageId        → imageAssetId
detailedDescription → description
```

## Mapper 경계

```text
src/app/groups/_utils/groupMappers.ts
└─ toGroupTagOptions

src/app/groups/new/_utils/groupCreateMapper.ts
├─ toGroupCreateRequest
└─ toCreatedGroupData
```

- `GroupCreateScreen`은 `GroupRequest`, `GroupDetailResponse` 등 Orval 타입을 import하지 않는다.
- API payload 필드 변경은 mapper에서 처리한다.
- 생성 hook 또는 query key 시그니처 변경은 Container에서 처리한다.
- 생성 응답 전체를 Screen에 전달하지 않고 생성된 그룹을 식별할 최소 모델만 반환한다.

## 데이터 흐름

```text
useGroupTags
└─ toGroupTagOptions
   └─ GroupCreateScreen

GroupCreateDraft
└─ toGroupCreateRequest
   └─ POST /v1/groups
      └─ toCreatedGroupData
         ├─ 그룹 목록 query invalidation
         └─ /groups/[groupId] 이동
```

## 이미지 업로드

- TMT-202에서 `POST /v1/media/upload-intents`가 presigned URL과 `assetId`를 반환한다.
- 그룹 대표 이미지도 같은 endpoint를 사용한다.
- TMT-201의 S3 버킷과 presigned 발급 권한 구성이 선행된다.
- 실제 업로드 연결 전에는 단일 이미지 선택과 로컬 미리보기까지만 제공한다.
- 업로드 연결 후 반환받은 `assetId`를 화면 모델의 `groupImageId`로 저장하고 mapper가 `imageAssetId`로 변환한다.

## 구현 체크리스트

### 1. 작업 기반

- [x] 최신 `develop`에서 TMT-146 브랜치 생성
- [x] `/groups/new` route 생성
- [x] Preview 진입 경로 추가
- [x] 기존 그룹 생성 이동 경로 확인

### 2. 화면 모델과 API 경계

- [x] `GroupCreateDraft` 정의
- [x] 기존 `toGroupTagOptions` 재사용
- [x] `toGroupCreateRequest` 구현
- [x] `toCreatedGroupData` 구현
- [x] Orval 타입을 Container와 mapper 밖으로 노출하지 않기

### 3. 화면 골격과 상태

- [x] `page.tsx`는 `GroupCreateContainer`만 렌더링
- [x] Container에서 태그 조회, 생성 mutation, 라우팅 담당
- [x] Screen에서 현재 단계와 draft 담당
- [x] 단계 이동 후에도 입력값 유지
- [x] 뒤로가기는 이전 단계로 이동
- [x] 첫 단계 이탈과 닫기 동작 정의

### 4. 1단계 — 기본 정보

- [x] 그룹명 입력
- [x] 한 줄 소개 입력
- [x] 필수 표시
- [x] 두 값이 유효할 때만 다음 버튼 활성화
- [x] 진행률 `0/4`

### 5. 2단계 — 카테고리와 지역

- [x] 음식 카테고리 단일 선택 BottomSheet
- [x] 지역 다중 선택 BottomSheet
- [x] 완료 전에는 sheet의 임시 선택값으로 관리
- [x] 닫으면 임시 변경 취소
- [x] 선택 완료 시 draft에 반영
- [x] 초기화 동작 제공
- [x] 진행률 `1/4`

### 6. 3단계 — 대표 이미지

- [x] 이미지 한 장 선택
- [x] 원형 미리보기
- [x] 이미지 교체와 제거
- [x] 이미지 없이 다음 단계 이동 가능
- [x] 진행률 `2/4`
- [x] TMT-202 연동 전 로컬 미리보기 제공

### 7. 4단계 — 상세 소개

- [x] 선택 입력으로 처리
- [x] 최대 200자
- [x] 입력 영역 내부 글자 수 표시
- [x] 진행률 `3/4`
- [x] 생성 중 중복 요청 방지
- [x] 생성 버튼 pending 상태 표시

### 8. 생성 API

- [x] `useGroupTags` 결과 변환
- [x] `useCreateGroup` 연결
- [x] 생성 요청과 응답 mapper 적용
- [x] 성공 후 그룹 목록 query invalidation
- [x] 성공 toast와 상세 이동
- [x] 실패 toast와 draft 유지

### 9. Preview와 검증

- [x] 각 단계 기본 상태
- [x] 1단계 validation 전후
- [x] 카테고리 선택
- [x] 지역 다중 선택과 초기화
- [x] 대표 이미지 미선택과 선택 상태
- [x] 상세 소개 200자 상태
- [x] 태그 조회 loading과 error
- [x] 생성 pending, success, error
- [ ] 긴 텍스트와 키보드, 스크롤, 고정 CTA 겹침 확인
- [x] `pnpm verify`

## 커밋 단위

1. 설계 문서와 화면 모델, mapper
2. 화면 골격과 4단계 UI
3. 생성 API 연결
4. Preview와 상태 검증

## 필수 후속 리팩터링

이 PR의 화면 구조는 그룹 생성 기능을 우선 연결하기 위한 1차 구현이다. 그룹 편집과 삭제를
연결하기 전에 아래 경계를 반드시 다시 정리한다.

- 생성과 편집이 공유할 입력 규칙을 확인한 뒤, 폼 전체가 아니라 단계별 화면 모델과 mapper 중
  실제로 동일한 부분만 공용화한다.
- `GroupDetailView`가 가입·탈퇴·생성 직후 첫 리뷰 안내의 UI 상태와 이동을 함께 소유하고 있다.
  그룹장 전용 편집·삭제 액션이 추가되기 전에 상세 액션의 상태와 정책 경계를 재설계한다.
- 생성 직후 안내를 나타내는 `?created=true`는 현재 라우팅 계약이다. 생성 응답이나 게시 작성
  진입 정책이 확정되면 URL 상태를 계속 사용할지 다시 결정한다.
- `EmptyNotice`의 `prominent` 변형은 첫 리뷰 안내를 위해 추가했다. 다른 화면에 확대 적용하기
  전에 문구 계층과 BottomSheet 내부 여백이 같은 사례인지 확인한다.

## 미구현 기능과 영향 범위

### 그룹 편집

- OpenAPI에는 그룹 편집 mutation(`useUpdateGroup`)이 생성되어 있지만 편집 route와 화면은 없다.
- 구현 시 그룹장 권한 검증, 기존 값 초기화, 이미지 유지·교체, 태그 변경, 요청 mapper를 다뤄야 한다.
- 성공 후 그룹 상세와 그룹 목록 query를 무효화해야 한다.
- 생성 화면과의 공용화는 필드·validation·요청 계약을 비교한 뒤 진행한다. 생성 컴포넌트를 그대로
  편집 화면에 재사용하는 방식은 피한다.

### 그룹 삭제

- 현재 OpenAPI 생성 코드에는 그룹 삭제 endpoint와 mutation이 없고, 삭제 route와 화면도 없다.
- 백엔드 계약이 추가되면 그룹장 전용 진입점, 확인 UI, 오류 코드별 안내, 삭제 후 목록 이동을
  구현해야 한다.
- 성공 후 그룹 상세·리뷰·목록 query를 제거하거나 무효화하고, 삭제된 상세로 되돌아가는 경로를
  차단해야 한다.
- 그룹 탈퇴와 삭제는 대상과 권한, 캐시 처리, 완료 후 이동이 다르므로 같은 action으로 합치지 않는다.
