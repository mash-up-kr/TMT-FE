import { useEffect, useState } from 'react'
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

function currentPath() {
  return window.location.pathname || routes.entry
}

function makeId(prefix) {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`
}

function avatarInitial(nickname) {
  return nickname.trim().slice(0, 1) || '게'
}

function App() {
  const [path, setPath] = useState(currentPath)
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
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function navigate(nextPath) {
    if (nextPath === currentPath()) {
      return
    }

    window.history.pushState({}, '', nextPath)
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
        onBack={() => navigate(routes.main)}
        onCreated={() => navigate(routes.main)}
      />
    )
  }

  if (path === routes.invite) {
    return (
      <InviteCodePage
        onBack={() => navigate(routes.entry)}
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
