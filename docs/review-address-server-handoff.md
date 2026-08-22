# 리뷰 작성 주소 처리 핸드오프

## 결정

주소 검색과 위치 확정은 서버가 담당한다.

- Client는 매장명을 입력하고 주소 검색 결과를 선택한다.
- Client는 선택한 결과의 `addressId`를 서버에 보낸다.
- Server는 `addressId`로 주소와 좌표를 확정하고, Place와 Review를 저장한다.

Client가 좌표를 보내거나 외부 주소 API를 직접 호출하지 않는다.

## 동작 시나리오

### 1. 주소 검색

```text
사용자
  → 주소 검색어 입력
Client
  → GET /v1/addresses/search?query=...
Server
  → 외부 주소 API 호출 및 응답 정규화
Client
  ← addressId, 도로명 주소, 지번 주소
```

Client는 결과를 보여주고 사용자가 하나를 선택하게 한다.

### 2. 리뷰 저장

```text
사용자
  → 매장명 입력 + 주소 선택 + 리뷰 작성
Client
  → POST /v1/reviews
     { storeName, addressId, rating, content, tagIds, assetIds }
Server
  → addressId 검증
  → 주소·좌표 확정
  → Place 생성 또는 기존 Place 연결
  → Review 저장
```

Place 생성과 Review 저장은 서버에서 한 번에 처리한다. Client가 `POST /places`와 `POST /reviews`를
따로 호출하면, 리뷰 저장 실패 시 Place만 남을 수 있다.

## 이 구조를 쓰는 이유

주소와 좌표는 지도 핀, 거리 계산, 주변 검색처럼 여러 기능의 기준 데이터가 된다.

Client에서 전달한 좌표는 수정할 수 있으므로 저장 기준으로 신뢰하면 안 된다. Server가 외부 주소 API의
결과를 확인하고 좌표를 확정하면, 이후 기능도 같은 위치 데이터를 사용한다.

외부 API 키와 응답 형식도 Server 뒤에 숨긴다. 외부 공급자가 바뀌어도 Client는 우리 주소 검색 응답만
사용하면 된다.

## API 계약

### 주소 검색 응답

```ts
type AddressSearchResult = {
  addressId: string;
  roadAddress: string;
  jibunAddress: string;
};
```

`addressId`는 Client가 표시용 주소와 함께 보관하는 서버 발급 식별자다. 주소 선택 후에는 이 값을
리뷰 저장 요청에 그대로 보낸다.

Server는 `addressId`를 사용자와 짧은 유효 기간에 묶고, 제출 시 유효성을 확인한다.

### 리뷰 저장 요청

```ts
type CreateReviewRequest = {
  storeName: string;
  addressId: string;
  rating?: number;
  content?: string;
  tagIds?: string[];
  assetIds?: string[];
};
```

좌표와 외부 공급자 응답 전체는 Client 요청에 넣지 않는다.

## 프론트엔드 반영 사항

현재 주소 검색 결과에는 `addressId`가 있지만, 선택 후에는 도로명 문자열만 초안에 저장한다.

리뷰 제출 API를 붙이기 전 다음 형태로 초안을 바꾼다.

```ts
type SelectedAddress = {
  addressId: string;
  displayAddress: string;
};

type ReviewPlaceDraft = {
  name: string;
  address: SelectedAddress | null;
};
```

매장명은 사용자 자유 입력값이다. 실제 음식점 존재 여부는 이 단계에서 검증하지 않는다.

## 범위 밖

- 외부 주소 API 공급자 선택
- Place 중복 판단 규칙
- 실제 음식점 DB 연동
- 사진 업로드와 리뷰 제출 endpoint 구현

이 요구가 생기면 서버 계약을 먼저 확정한 뒤 Client를 연결한다.
