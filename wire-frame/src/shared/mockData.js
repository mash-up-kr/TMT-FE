/**
 * Mock data — DDK-18 v0.1 스키마(정규화) 형태.
 *
 * 정규화 엔티티(USERS / GROUPS / PLACES / REVIEWS / SESSION)가 단일 진실 소스이고,
 * 화면에 필요한 집계·표시값(또갈래율, "N명 중 M명", 거리, 도보시간 등)은
 * 저장하지 않고 selectors.js 에서 매번 계산한다.
 *
 * 참고: https://ttalkkak.atlassian.net/wiki/spaces/ttalkkak/pages/17203201
 */

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

/* --- DDK-18 엔티티 --- */

export const USERS = [
  { id: 'u_jun', nickname: '준표', avatarColor: '#ff6b6b', avatarInitial: '준' },
  { id: 'u_hye', nickname: '혜인', avatarColor: '#4ecdc4', avatarInitial: '혜' },
  { id: 'u_woo', nickname: '정우', avatarColor: '#ffd93d', avatarInitial: '정' },
  { id: 'u_min', nickname: '민서', avatarColor: '#a78bfa', avatarInitial: '민' },
  { id: 'u_hyung', nickname: '준형', avatarColor: '#60a5fa', avatarInitial: '형' },
]

const ALL_MEMBERS = USERS.map((u) => u.id)

export const GROUPS = [
  {
    id: 'g_ddak',
    name: '딸깍 맛집',
    icon: '🍜',
    iconColor: '#1c1c1c',
    iconInitial: '딸',
    memberIds: ALL_MEMBERS,
    inviteCode: 'DDAK01',
    createdBy: 'u_jun',
    createdAt: '2026-04-28T10:00:00Z',
  },
  {
    id: 'g_jungnang',
    name: '중랑구 불주먹 모임',
    icon: '🍔',
    iconColor: '#ff4848',
    iconInitial: '중',
    memberIds: ALL_MEMBERS,
    inviteCode: 'JUNG02',
    createdBy: 'u_hye',
    createdAt: '2026-04-15T10:00:00Z',
  },
  {
    id: 'g_dawn',
    name: '새벽회식조',
    icon: '🍔',
    iconColor: '#60a5fa',
    iconInitial: '새',
    memberIds: ALL_MEMBERS,
    inviteCode: 'DAWN03',
    createdBy: 'u_woo',
    createdAt: '2026-05-19T10:00:00Z',
  },
]

export const PLACES = [
  // g_ddak — 딸깍 맛집
  { id: 'p_d1', groupId: 'g_ddak', name: '을지로 노포', address: '서울 중구 을지로12길 21', location: { lat: 37.5662, lng: 126.9913 }, category: 'KOREAN', createdBy: 'u_jun', createdAt: '2026-05-12T12:10:00Z' },
  { id: 'p_d2', groupId: 'g_ddak', name: '광장시장 빈대떡', address: '서울 종로구 창경궁로 88', location: { lat: 37.5701, lng: 126.9997 }, category: 'TRADITIONAL', createdBy: 'u_hye', createdAt: '2026-05-14T19:30:00Z' },
  { id: 'p_d3', groupId: 'g_ddak', name: '을지로 라멘집', address: '서울 중구 을지로 153', location: { lat: 37.5668, lng: 126.9925 }, category: 'JAPANESE', createdBy: 'u_woo', createdAt: '2026-05-18T13:00:00Z' },
  { id: 'p_d4', groupId: 'g_ddak', name: '충무로 카페', address: '서울 중구 충무로5길 12', location: { lat: 37.5614, lng: 126.9945 }, category: 'CAFE', createdBy: 'u_min', createdAt: '2026-04-20T15:00:00Z' },
  // g_jungnang — 중랑구 불주먹 모임
  { id: 'p_j1', groupId: 'g_jungnang', name: '면목동 곱창집', address: '서울 중랑구 면목로 73', location: { lat: 37.5851, lng: 127.0875 }, category: 'KOREAN', createdBy: 'u_hye', createdAt: '2026-05-10T18:00:00Z' },
  { id: 'p_j2', groupId: 'g_jungnang', name: '상봉 닭한마리', address: '서울 중랑구 망우로 35', location: { lat: 37.5963, lng: 127.0853 }, category: 'KOREAN', createdBy: 'u_jun', createdAt: '2026-05-13T19:00:00Z' },
  { id: 'p_j3', groupId: 'g_jungnang', name: '중화동 김밥천국', address: '서울 중랑구 동일로 921', location: { lat: 37.6004, lng: 127.0788 }, category: 'ETC', createdBy: 'u_min', createdAt: '2026-05-16T12:00:00Z' },
  { id: 'p_j4', groupId: 'g_jungnang', name: '망우동 칼국수', address: '서울 중랑구 망우로 415', location: { lat: 37.5994, lng: 127.1003 }, category: 'KOREAN', createdBy: 'u_hyung', createdAt: '2026-04-25T11:30:00Z' },
  // g_dawn — 새벽회식조: 등록된 가게 없음 (빈 그룹)
]

/* Review 시드 — [userId, vote, oneLiner] 행을 레코드로 펼친다. */
function seedReviews(placeId, rows) {
  return rows.map(([userId, vote, oneLiner], i) => ({
    id: `r_${placeId}_${i + 1}`,
    placeId,
    userId,
    vote,
    oneLiner,
    photos: [],
    createdAt: '2026-05-20T12:00:00Z',
  }))
}

export const REVIEWS = [
  ...seedReviews('p_d1', [
    ['u_jun', 'GO_AGAIN', '분위기 미쳤음. 재방문 확정'],
    ['u_hye', 'GO_AGAIN', '아 배고파'],
    ['u_woo', 'ONCE', '한번 가볼만'],
    ['u_min', 'GO_AGAIN', '국물이 진하다'],
    ['u_hyung', 'NEVER', '난 별로였음'],
  ]),
  ...seedReviews('p_d2', [
    ['u_jun', 'GO_AGAIN', '빈대떡 바삭함'],
    ['u_hye', 'GO_AGAIN', '막걸리랑 찰떡'],
    ['u_woo', 'GO_AGAIN', '또 가고 싶다'],
    ['u_min', 'GO_AGAIN', '녹두전 최고'],
    ['u_hyung', 'ONCE', '한 번이면 충분'],
  ]),
  ...seedReviews('p_d3', [
    ['u_jun', 'GO_AGAIN', '국물 깔끔하다'],
    ['u_hye', 'ONCE', '보통이었음'],
    ['u_woo', 'GO_AGAIN', '차슈가 굿'],
    ['u_hyung', 'NEVER', '줄이 너무 길어'],
  ]),
  ...seedReviews('p_d4', [
    ['u_jun', 'GO_AGAIN', '디저트 맛집'],
    ['u_hye', 'NEVER', '너무 시끄러움'],
    ['u_woo', 'ONCE', '커피는 그럭저럭'],
    ['u_min', 'GO_AGAIN', '공부하기 좋음'],
    ['u_hyung', 'NEVER', '자리가 불편'],
  ]),
  ...seedReviews('p_j1', [
    ['u_hye', 'GO_AGAIN', '곱창 신선하다'],
    ['u_jun', 'GO_AGAIN', '무조건 또 갈래'],
    ['u_woo', 'GO_AGAIN', '소금구이 굿'],
    ['u_min', 'GO_AGAIN', '양이 많음'],
    ['u_hyung', 'ONCE', '좀 기름져'],
  ]),
  ...seedReviews('p_j2', [
    ['u_hye', 'GO_AGAIN', '국물이 시원'],
    ['u_jun', 'GO_AGAIN', '겨울에 딱'],
    ['u_woo', 'GO_AGAIN', '칼국수 사리 필수'],
    ['u_min', 'ONCE', '무난했음'],
    ['u_hyung', 'NEVER', '양이 좀 적음'],
  ]),
  ...seedReviews('p_j3', [
    ['u_hye', 'GO_AGAIN', '가성비 갑'],
    ['u_jun', 'ONCE', '그냥 분식 맛'],
    ['u_woo', 'GO_AGAIN', '라볶이 맛있음'],
    ['u_min', 'NEVER', '내 취향은 아님'],
  ]),
  ...seedReviews('p_j4', [
    ['u_hye', 'GO_AGAIN', '면이 쫄깃'],
    ['u_jun', 'ONCE', '평범한 칼국수'],
    ['u_woo', 'NEVER', '간이 너무 세'],
    ['u_min', 'GO_AGAIN', '비 오는 날 생각남'],
    ['u_hyung', 'NEVER', '재방문은 글쎄'],
  ]),
]

export const SESSION = {
  currentUserId: 'u_jun',
  currentGroupId: 'g_ddak',
  currentLocation: {
    address: '서울 중구 을지로 30',
    lat: 37.5658,
    lng: 126.991,
  },
}

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
export const DEFAULT_GROUP_NAME = GROUPS[0].name
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
