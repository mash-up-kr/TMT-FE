/**
 * Mock data — DDK-18 v0.3 스키마 (정규화).
 *
 * 엔티티(USERS / GROUPS / PLACES / REVIEWS / SESSION)는 mock-data.json 에서 직접 로드.
 * 집계·표시값(또갈래율, "N명 중 M명", 거리, 도보시간 등)은 저장하지 않고
 * selectors.js 에서 매번 계산한다.
 *
 * 참고: https://ttalkkak.atlassian.net/wiki/spaces/ttalkkak/pages/17203201
 */
import mockData from './mock-data.json'

/* --- 코드값 ↔ 한글 라벨 (UI 표시는 라벨, 저장은 enum) --- */

export const CATEGORY_LABELS = {
  KOREAN: '한식',
  JAPANESE: '일식',
  CHINESE: '중식',
  WESTERN: '양식',
  CAFE: '카페',
  BAR: '술집',
  TRADITIONAL: '전통',
  ETC: '기타',
}

export const VOTE_LABELS = {
  GO_AGAIN: '또 갈래',
  ONCE: '한 번',
  NEVER: '언젠간',
}

/* --- DDK-18 엔티티 (mock-data.json 에서 로드) --- */

export const USERS = mockData.users

/* groupId 별 표시용 이모지 (스키마 외 UI 장식 — JSON에 없어서 별도 매핑) */
const GROUP_ICON_MAP = {
  g_gangnam: '🍔',
  g_seolleung: '🍱',
  g_yeouido: '☕',
  g_hapjeong: '🍻',
}

export const GROUPS = mockData.groups.map((g) => ({
  ...g,
  icon: GROUP_ICON_MAP[g.id] ?? '🍜',
}))

/* --- 지역(region) ↔ 그룹 매핑 (URL ?region= 파라미터로 진입 시 사용) --- */
export const REGION_TO_GROUP_ID = {
  gangnam: 'g_gangnam',
  seolleung: 'g_seolleung',
  yeouido: 'g_yeouido',
  hapjeong: 'g_hapjeong',
}

export const GROUP_ID_TO_REGION = Object.fromEntries(
  Object.entries(REGION_TO_GROUP_ID).map(([k, v]) => [v, k]),
)

/* 각 그룹의 기본 지도 중심 좌표 (해당 지역 역 근처) */
export const GROUP_LOCATIONS = {
  g_gangnam: {
    address: '서울특별시 강남구 강남대로 396',
    lat: 37.4979,
    lng: 127.0276,
  },
  g_seolleung: {
    address: '서울특별시 강남구 선릉로 524',
    lat: 37.5044,
    lng: 127.0489,
  },
  g_yeouido: {
    address: '서울특별시 영등포구 여의대로 24',
    lat: 37.5219,
    lng: 126.9244,
  },
  g_hapjeong: {
    address: '서울특별시 마포구 양화로 45',
    lat: 37.5495,
    lng: 126.9136,
  },
}

export const PLACES = mockData.places

export const REVIEWS = mockData.reviews

/**
 * 현재 세션 — URL ?region= 파라미터로 지역 결정.
 * 지원: gangnam / seolleung / yeouido. 미지정·미매칭 시 JSON 의 기본값(yeouido).
 */
function resolveSession() {
  const fallback = mockData.session
  if (typeof window === 'undefined') {
    return fallback
  }
  const region = new URLSearchParams(window.location.search).get('region')
  const groupId = REGION_TO_GROUP_ID[region]
  if (!groupId) {
    return fallback
  }
  return {
    ...fallback,
    currentGroupId: groupId,
    currentLocation: GROUP_LOCATIONS[groupId] ?? fallback.currentLocation,
  }
}

export const SESSION = resolveSession()

/* --- 위치 검색 후보 (지도 API 대체용 mock POI — 스키마 엔티티 아님) --- */

export const SEARCH_CANDIDATES = [
  { name: '을지로 노포', address: '서울 중구 을지로12길 21', location: { lat: 37.5662, lng: 126.9913 } },
  { name: '을지로 노포 비스트로', address: '서울 중구 을지로 153', location: { lat: 37.5668, lng: 126.9925 } },
  { name: '노포 식당', address: '서울 중구 을지로4가 17', location: { lat: 37.5671, lng: 126.9948 } },
  { name: '광장시장 빈대떡', address: '서울 종로구 창경궁로 88', location: { lat: 37.5701, lng: 126.9997 } },
  { name: '충무로 카페', address: '서울 중구 충무로5길 12', location: { lat: 37.5614, lng: 126.9945 } },
  { name: '종로 손칼국수', address: '서울 종로구 종로12길 5', location: { lat: 37.5705, lng: 126.9876 } },
]

/* --- UI 상수 (엔티티 아님 — 화면 라벨/장식) --- */

export const MAIN_TABS = ['내 맛집', '내 그룹']
export const RESTAURANT_FILTER_CHIPS = ['또 갈래율', '최근 등록']
export const EMPTY_GROUP_TABS = ['리스트', '지도']
export const STORE_RATINGS = ['또 갈래', '한번쯤은 낫밷', '안 갈래']
/* STORE_RATINGS 인덱스 ↔ Review.vote enum */
export const RATING_VOTES = ['GO_AGAIN', 'ONCE', 'NEVER']
export const MAP_FILTER_CHIPS = ['또 갈래만', '한번 정도는']

/* 가짜 지도용 장식 핀 좌표 — 실제 지도 연동 시 PLACES.location 으로 대체 */
export const MAP_PINS = [
  { type: 'red', top: '22%', left: '24%' },
  { type: 'red', top: '48%', left: '55%' },
  { type: 'red', top: '62%', left: '28%' },
  { type: 'red', top: '30%', left: '68%' },
  { type: 'grey', top: '42%', left: '38%' },
  { type: 'grey', top: '72%', left: '62%' },
  { type: 'white', top: '36%', left: '82%' },
]

export const INITIAL_INVITE_CODE = ['G', '', '', '', '', '']

/* 새 그룹 만들기 화면 */
export const GROUP_ICONS = ['🍜', '🍣', '☕', '🍔', '🍺', '🥘']
export const SHARE_URL =
  'https://www.figma.com/design/HWskrJLpHMCyIHma7pfINu/-Web-'
export const SHARE_TARGETS = [
  { label: 'AirDrop', icon: 'airdrop' },
  { label: '메시지', icon: 'message' },
  { label: '카카오톡', icon: 'kakao' },
  { label: 'Instagram', icon: 'instagram' },
  { label: 'Discord', icon: 'discord' },
]
