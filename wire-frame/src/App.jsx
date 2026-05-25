import { useEffect, useRef, useState } from 'react'
import CreateNewGroupPage from './pages/create-new-group/CreateNewGroupPage.jsx'
import FirstEntryPage from './pages/first-entry/FirstEntryPage.jsx'
import InviteCodePage from './pages/invite-code/InviteCodePage.jsx'
import MainPage from './pages/main/MainPage.jsx'
import { GROUPS, PLACES, REVIEWS, SESSION, USERS } from './shared/mockData.js'

const routes = {
  entry: '/',
  main: '/main',
  createGroup: '/groups/new',
  invite: '/invite',
}

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')

function currentPath() {
  return window.location.hash.slice(1) || routes.entry
}

function routeUrl(path) {
  const rootPath = basePath ? `${basePath}/` : routes.entry
  /* 현재 URL 의 ?region= 같은 search 는 유지 — 지역 스위치가 navigate 후에도 살아남음 */
  const search = window.location.search

  return path === routes.entry
    ? `${rootPath}${search}`
    : `${rootPath}${search}#${path}`
}

function makeId(prefix) {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`
}

function avatarInitial(nickname) {
  return nickname.trim().slice(0, 1) || '게'
}

function App() {
  const [path, setPath] = useState(currentPath)
  /* 모달성 화면(createGroup/invite) 진입 직전 path — onBack 폴백용 */
  const backTargetRef = useRef(routes.entry)
  const [data, setData] = useState(() => ({
    users: USERS,
    groups: GROUPS,
    places: PLACES,
    reviews: REVIEWS,
    session: SESSION,
  }))

  useEffect(() => {
    const handlePopState = () => setPath(currentPath())
    window.addEventListener('popstate', handlePopState)
    window.addEventListener('hashchange', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('hashchange', handlePopState)
    }
  }, [])

  function navigate(nextPath) {
    if (nextPath === currentPath()) {
      return
    }

    /* createGroup/invite 로 진입할 때만 진입 직전 path 를 기록.
       모달성 화면끼리 점프하면 직전 일반 화면이 그대로 유지됨. */
    if (
      (nextPath === routes.createGroup || nextPath === routes.invite) &&
      path !== routes.createGroup &&
      path !== routes.invite
    ) {
      backTargetRef.current = path
    }

    window.history.pushState({}, '', routeUrl(nextPath))
    setPath(nextPath)
  }

  function startAsUser(nickname) {
    setData((prev) => {
      const nextNickname = nickname.trim() || '게스트'
      const userId = makeId('u')
      const currentGroupId = prev.session.currentGroupId
      const user = {
        id: userId,
        nickname: nextNickname,
        avatarColor: '#1c1c1c',
        avatarInitial: avatarInitial(nextNickname),
      }

      return {
        ...prev,
        users: [...prev.users, user],
        groups: prev.groups.map((group) =>
          group.id === currentGroupId
            ? { ...group, memberIds: [...group.memberIds, userId] }
            : group,
        ),
        session: {
          ...prev.session,
          currentUserId: userId,
        },
      }
    })
    navigate(routes.main)
  }

  /* 가게 추가 — 새 Place + 현재 유저의 Review 한 건을 생성 */
  function addPlace({ groupId, name, address, location, vote, oneLiner }) {
    setData((prev) => {
      const placeId = makeId('p')
      const now = new Date().toISOString()
      const place = {
        id: placeId,
        groupId,
        name,
        address,
        location,
        category: 'ETC',
        createdBy: prev.session.currentUserId,
        createdAt: now,
      }
      const review = {
        id: makeId('r'),
        placeId,
        userId: prev.session.currentUserId,
        vote,
        oneLiner,
        photos: [],
        createdAt: now,
      }
      return {
        ...prev,
        places: [...prev.places, place],
        reviews: [...prev.reviews, review],
      }
    })
  }

  function saveReview({ placeId, vote, oneLiner }) {
    setData((prev) => {
      const now = new Date().toISOString()
      const review = prev.reviews.find(
        (r) => r.placeId === placeId && r.userId === prev.session.currentUserId,
      )

      if (review) {
        return {
          ...prev,
          reviews: prev.reviews.map((r) =>
            r.id === review.id ? { ...r, vote, oneLiner } : r,
          ),
        }
      }

      return {
        ...prev,
        reviews: [
          ...prev.reviews,
          {
            id: makeId('r'),
            placeId,
            userId: prev.session.currentUserId,
            vote,
            oneLiner,
            photos: [],
            createdAt: now,
          },
        ],
      }
    })
  }

  function deleteReview({ placeId }) {
    setData((prev) => ({
      ...prev,
      reviews: prev.reviews.filter(
        (r) =>
          !(
            r.placeId === placeId &&
            r.userId === prev.session.currentUserId
          ),
      ),
    }))
  }

  if (path === routes.main) {
    return (
      <MainPage
        data={data}
        addPlace={addPlace}
        saveReview={saveReview}
        deleteReview={deleteReview}
        onCreateGroup={() => navigate(routes.createGroup)}
      />
    )
  }

  if (path === routes.createGroup) {
    return (
      <CreateNewGroupPage
        onBack={() => navigate(backTargetRef.current)}
        onCreated={() => navigate(routes.main)}
      />
    )
  }

  if (path === routes.invite) {
    return (
      <InviteCodePage
        onBack={() => navigate(backTargetRef.current)}
        onSubmit={() => navigate(routes.main)}
      />
    )
  }

  return (
    <FirstEntryPage
      data={data}
      onStart={startAsUser}
      onCreateGroup={() => navigate(routes.createGroup)}
      onInviteCode={() => navigate(routes.invite)}
    />
  )
}

export default App
