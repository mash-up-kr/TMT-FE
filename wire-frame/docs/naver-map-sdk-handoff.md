# Naver Map SDK Handoff

## 목적

추후 네이버지도 SDK를 붙일 팀원이 현재 와이어프레임의 스키마 데이터를 어디서 읽고, 지도/검색/저장 흐름에 어떻게 주입해야 하는지 빠르게 파악하기 위한 문서다.

현재 앱은 실제 지도 SDK 없이 mock 데이터와 가짜 지도 UI로 동작한다. 다만 저장된 장소 스키마, 위치 검색 후보, 화면용 selector, 저장 흐름이 이미 분리되어 있어 네이버지도 SDK를 연결할 수 있는 구조다.

이 문서의 범위는 **앱 내부 데이터 배선**(어디서 읽고 어디로 주입하는가)이다. 네이버 Maps JS SDK 자체의 부트스트랩 — 스크립트 로드(`naver.maps` 전역), `ncpClientId` 발급과 환경변수, `index.html` 삽입 — 은 이 문서 범위 밖이며 SDK 담당자가 별도로 준비해야 한다.

## 현재 데이터 구조

주요 파일은 `src/shared/mockData.js`다.

- `USERS`: 사용자 목록
- `GROUPS`: 그룹 목록
- `PLACES`: 저장된 장소 목록
- `REVIEWS`: 장소별 사용자 평가
- `SESSION`: 현재 사용자, 현재 그룹, 현재 위치
- `SEARCH_CANDIDATES`: 지도 API 대체용 mock 장소 검색 결과
- `MAP_PINS`: 실제 좌표가 아닌 가짜 지도 장식용 핀

`PLACES`가 앱에 저장된 장소의 source of truth다. 네이버지도에서 마커를 찍을 때는 `MAP_PINS`가 아니라 `PLACES[].location`을 사용해야 한다.

```js
{
  id: 'p_d1',
  groupId: 'g_ddak',
  name: '을지로 노포',
  address: '서울 중구 을지로12길 21',
  location: { lat: 37.5662, lng: 126.9913 },
  category: 'KOREAN',
  createdBy: 'u_jun',
  createdAt: '2026-05-12T12:10:00Z',
}
```

`SEARCH_CANDIDATES`는 저장된 장소가 아니라 검색 후보 mock이다. 네이버 장소 검색 또는 지도에서 직접 선택한 결과는 이 배열과 같은 최소 형태로 normalize하면 기존 UI에 바로 연결할 수 있다.

```js
{
  name: '을지로 노포',
  address: '서울 중구 을지로12길 21',
  location: { lat: 37.5662, lng: 126.9913 },
}
```

## 화면 주입 흐름

화면에 필요한 값은 `src/shared/selectors.js`에서 계산한다.

- `getGroupViews(data)`: 그룹별 저장 장소 목록과 통계를 만든다.
- `getCurrentGroupRestaurants(data)`: 현재 그룹의 장소 리스트를 만든다.
- `getRestaurantDetail(data, placeId)`: 장소 상세의 평가, 거리, 도보 시간을 만든다.
- `getSearchResults(data)`: `SEARCH_CANDIDATES`를 검색 결과 UI용 값으로 바꾼다.

현재 거리는 `SESSION.currentLocation`과 장소의 `location`을 haversine으로 계산한다. 실제 경로 기반 도보 시간이 필요해지면 이 selector의 거리/시간 계산만 네이버 Directions 계열 결과로 교체하면 된다.

## 네이버지도 SDK 연결 권장 지점

### 1. 지도 마커

현재 그룹 상세 지도는 `src/pages/main/MainPage.jsx`의 `GroupMapView`에서 `MAP_PINS`를 렌더링한다.

현재 `GroupMapView`는 `{ onAddStore }` prop만 받는다 — 그룹/장소 데이터를 전혀 받지 않는다. 또한 `GroupMapView`는 `GroupDetail` 내부에 있으므로, 마커 데이터를 넘기려면 `MainPage → GroupDetail → GroupMapView` 경로로 prop을 새로 연결해야 한다.

가짜 지도는 세 곳에 있다: ① `GroupMapView`의 그룹 지도, ② 메인 "내 맛집" 탭의 "내 지도" 미니맵, ③ "가게 추가" 폼의 "위치" 미니맵. ②③은 `.mp-map` div에 정적 핀(`.mp-map-pin`)만 있다. 특히 ③은 `selectedPlace.location`을 실제 지도로 보여줘야 자연스러우므로 SDK 연동 시 함께 교체 대상이다.

SDK 연결 시 권장 변경:

- 마커용 selector(아래 "권장 구현 순서" 1번)로 현재 그룹의 장소를 `{ id, name, address, location, category }` 형태로 얻는다.
- 그 결과를 `MainPage → GroupDetail → GroupMapView` 경로로 prop을 새로 추가해 전달한다.
- `GroupMapView`에서 `MAP_PINS` 렌더링을 제거하고, 전달받은 장소를 네이버 지도 마커로 렌더링한다.
- 마커 좌표는 `place.location.lat`, `place.location.lng`를 사용한다.

주의: 현재 `restaurantVM()`은 리스트 표시용이라 `location`을 포함하지 않는다. 지도 마커에는 원본 `Place` 또는 `location`을 포함한 별도 selector가 필요하다.

### 2. 장소 검색

현재 장소 검색은 `AddStorePanel`이 `MainPage`에서 `getSearchResults(data)`로 만든 `searchResults`를 받아, 내부의 `StoreSearch`에 `results` prop으로 넘겨 렌더링한다.

SDK 연결 시 권장 변경:

- `SEARCH_CANDIDATES` import 의존을 제거한다.
- 검색어 변경 시 네이버 장소 검색 결과를 가져온다.
- 네이버 결과를 아래 형태로 normalize한다.

```js
{
  name,
  address,
  location: { lat, lng },
}
```

- 기존 `StoreSearch`의 `onSelect(p)`로 전달한다.
- `selectedPlace`에 들어간 객체는 저장 시 `AddStorePanel.handleSave()`가 `name` / `address` / `location` 세 키만 골라 `App.addPlace()`로 넘긴다. 따라서 normalize 객체는 이 세 키 이름을 정확히 맞춰야 한다(하드 계약).

### 3. 지도에서 직접 선택

현재 "지도에서 직접 선택" 버튼은 검색 패널을 닫기만 한다. 실제 SDK 연결 시 이 버튼은 지도 선택 모드로 진입하는 entry point로 쓰면 된다.

권장 흐름:

1. 사용자가 "지도에서 직접 선택"을 누른다.
2. 네이버 지도에서 중심 좌표 또는 클릭 좌표를 선택한다.
3. 좌표를 reverse geocoding해서 주소를 얻는다.
4. `{ name, address, location }` 형태로 `selectedPlace`에 넣는다.
5. 사용자가 평가와 한줄평을 입력하고 저장한다.

## 저장 흐름

저장은 `src/App.jsx`의 `addPlace()`가 담당한다.

현재 흐름:

1. `AddStorePanel.handleSave()`가 `selectedPlace`와 평가 값을 합쳐 `onSave()`를 호출한다.
2. `MainPage.handleSavePlace()`가 현재 저장 대상 `groupId`를 추가한다.
3. `App.addPlace()`가 새 `Place`와 현재 사용자의 `Review` 1건을 만든다.

`addPlace()`가 기대하는 입력:

```js
{
  groupId,
  name,
  address,
  location: { lat, lng },
  vote,
  oneLiner,
}
```

네이버지도 SDK 담당자는 SDK 결과를 이 입력 형태에 맞추는 adapter만 만들면 현재 저장 흐름을 유지할 수 있다.

참고: `addPlace()`는 현재 새 장소의 `category`를 `'ETC'`로 고정한다. 네이버 장소 검색은 카테고리 정보를 제공하므로, normalize 단계에서 네이버 카테고리를 `mockData.js`의 `category` enum(`KOREAN` / `JAPANESE` / `CHINESE` / `WESTERN` / `CAFE` / `BAR` / `TRADITIONAL` / `ETC`)으로 매핑하고, `addPlace()` 입력과 `App.addPlace()` 양쪽에 `category`를 추가하는 것을 권장한다.

## 권장 구현 순서

1. `src/shared/selectors.js`에 지도 마커용 selector를 추가한다.
   - 예: 현재 그룹의 원본 `Place` 목록을 `{ id, name, address, location, category }` 형태로 반환
2. `GroupMapView`에서 `MAP_PINS` 대신 selector 결과로 네이버 지도 마커를 렌더링한다.
3. 장소 검색은 `SEARCH_CANDIDATES` 대신 네이버 검색 결과를 같은 shape으로 normalize한다.
4. "지도에서 직접 선택" 버튼에 지도 선택 모드를 연결한다.
5. 저장은 기존 `AddStorePanel -> MainPage.handleSavePlace -> App.addPlace` 경로를 유지한다.

## 유지해야 할 계약

- 저장된 장소의 좌표 필드는 `location: { lat, lng }`로 유지한다.
- 화면 집계값은 저장하지 않는다. 또갈래율, 거리, 도보시간은 selector에서 계산한다.
- `SEARCH_CANDIDATES`는 mock 검색 후보일 뿐 DB/스키마 엔티티가 아니다.
- `MAP_PINS`는 실제 데이터가 아니므로 SDK 연동 후에는 사용하지 않는다.
- 네이버 SDK 결과를 앱 내부로 넣기 전 `{ name, address, location }` 형태로 normalize한다.

## 현재 구조 판단

네이버지도 SDK를 연결하기에 충분한 구조다. 이유는 저장 스키마(`PLACES`), 검색 mock(`SEARCH_CANDIDATES`), 화면 변환(`selectors.js`), 저장 mutation(`App.addPlace`)이 이미 분리되어 있기 때문이다.

다만 실제 연동 전에는 지도 마커용 selector를 하나 추가하는 것이 좋다. 현재 리스트용 `restaurantVM()`은 `location`을 노출하지 않기 때문에, 지도 컴포넌트가 리스트 view model에 의존하면 다시 좌표를 찾는 우회 로직이 생긴다.
