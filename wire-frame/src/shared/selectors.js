/**
 * Selectors — 정규화 엔티티에서 화면 표시용 값을 계산하는 순수 함수.
 *
 * 모든 함수는 data 객체({ users, groups, places, reviews, session })를 받는다.
 * DDK-18 설계 원칙: 집계값(또갈래율, "N명 중 M명")·거리·도보시간은 저장하지 않고
 * 여기서 reviews / location 으로 매번 계산한다.
 */
import { CATEGORY_LABELS, SEARCH_CANDIDATES, VOTE_LABELS } from './mockData.js'

/* 두 좌표 사이 거리(km) — haversine */
function distanceKm(a, b) {
  const R = 6371
  const toRad = (deg) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

function voteCounts(reviews) {
  return {
    again: reviews.filter((r) => r.vote === 'GO_AGAIN').length,
    once: reviews.filter((r) => r.vote === 'ONCE').length,
    someday: reviews.filter((r) => r.vote === 'NEVER').length,
  }
}

/* 가게의 대표 vote 등급
 * - red:   GO_AGAIN 비율 50% 이상 (또 갈래)
 * - grey:  GO_AGAIN + ONCE 합산 50% 이상 (한 번 정도는)
 * - white: 그 외 (NEVER 다수 또는 리뷰 없음) */
function placeVoteTier(reviews) {
  const total = reviews.length
  if (!total) return 'white'
  const { again, once } = voteCounts(reviews)
  if (again / total >= 0.5) return 'red'
  if ((again + once) / total >= 0.5) return 'grey'
  return 'white'
}

/* 가게(Place) → 리스트 행 표시용 뷰모델 */
function restaurantVM(place, reviews) {
  const own = reviews.filter((r) => r.placeId === place.id)
  const total = own.length
  const { again } = voteCounts(own)
  const ratio = total ? again / total : 0
  return {
    id: place.id,
    name: place.name,
    location: place.location,
    voteTier: placeVoteTier(own),
    createdAt: place.createdAt,
    ratio,
    meta: `${CATEGORY_LABELS[place.category]} · ${total}명 중 ${again}명 또 갈래`,
    pct: `${Math.round(ratio * 100)}%`,
    hot: ratio >= 0.6,
  }
}

/* 그룹(Group) → 그룹 카드/상세 표시용 뷰모델 */
function groupVM(group, data) {
  const places = data.places.filter((p) => p.groupId === group.id)
  const members = group.memberIds.map((id) =>
    data.users.find((u) => u.id === id),
  )
  const memberCount = members.length
  const latestMonth = data.places
    .map((p) => p.createdAt.slice(0, 7))
    .sort()
    .at(-1)
  const monthly = places.filter(
    (p) => p.createdAt.slice(0, 7) === latestMonth,
  ).length
  const lead = members[0]
  return {
    id: group.id,
    icon: group.icon,
    name: group.name,
    meta: `멤버 ${memberCount} · 가게 ${places.length}`,
    stats: { saved: places.length, members: memberCount, monthly },
    memberInitials: members.map((u) => u.avatarInitial),
    membersText:
      memberCount > 1
        ? `${lead.nickname} 외 ${memberCount - 1}명`
        : lead.nickname,
    restaurants: places.map((p) => restaurantVM(p, data.reviews)),
  }
}

/* 전체 그룹 뷰모델 (그룹 목록·상세에서 사용) */
export function getGroupViews(data) {
  return data.groups.map((g) => groupVM(g, data))
}

/* 현재 그룹(session)의 가게 목록 — 메인 '내 맛집' 탭 */
export function getCurrentGroupRestaurants(data) {
  const current = getGroupViews(data).find(
    (g) => g.id === data.session.currentGroupId,
  )
  return current ? current.restaurants : []
}

/* 가게 상세 화면용 — 가게별 평가 집계 + 멤버 리뷰 */
export function getRestaurantDetail(data, placeId) {
  const place = data.places.find((p) => p.id === placeId)
  const reviews = data.reviews.filter((r) => r.placeId === placeId)
  const counts = voteCounts(reviews)

  let submeta = ''
  if (place) {
    const meters =
      distanceKm(data.session.currentLocation, place.location) * 1000
    const walkMin = Math.max(1, Math.round(meters / 75))
    const district = place.address.split(' ')[1] ?? ''
    submeta = `${CATEGORY_LABELS[place.category]} · 도보 ${walkMin}분 · ${district}`
  }

  return {
    submeta,
    counts,
    total: reviews.length,
    reviews: reviews.map((r) => {
      const user = data.users.find((u) => u.id === r.userId)
      return {
        name: user.nickname,
        avatar: user.avatarColor,
        rating: VOTE_LABELS[r.vote],
        hot: r.vote === 'GO_AGAIN',
        comment: r.oneLiner ?? '',
      }
    }),
  }
}

/* 위치 검색 결과 — 후보 + 현재 위치 기준 거리 계산 */
export function getSearchResults(data) {
  return SEARCH_CANDIDATES.map((candidate) => ({
    name: candidate.name,
    address: candidate.address,
    location: candidate.location,
    dist: `${distanceKm(data.session.currentLocation, candidate.location).toFixed(1)}km`,
  }))
}
